import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

const ALTERNATING_COLORS = ['#DC2626', '#2563EB']; // Dark red, Blue

const CHROMOSOME_LENGTHS = [
    248956422, 242193529, 198295559, 190214555, 181538259, 170805979,
    159345973, 145138636, 138394717, 133797422, 135086622, 133275309,
    114364328, 107043718, 101991189, 90338345, 83257441, 80373285,
    58617616, 64444167, 46709983, 50818468
];

export const Manhattan = ({ dyn, stat, threshold, onSNPClick, phenoId, selectedCohort, selectedStudy, filterLimit, filterMinPValue }) => {
    const [leadSNPs, setLeadSNPs] = useState([]);
    const [layout, setLayout] = useState({});
    const GAP = 0.008;
    const CHR_COUNT = CHROMOSOME_LENGTHS.length;
    const GAP_COUNT = CHR_COUNT - 1;

    const totalLength = CHROMOSOME_LENGTHS.reduce((a, b) => a + b, 0);
    const totalScale = 1 + GAP_COUNT * GAP;
    const scaleFactor = 1 / totalScale;

    const chrPositions = [];
    let currentPos = 0;
    for (let i = 0; i < CHR_COUNT; i++) {
        const chrFrac = (CHROMOSOME_LENGTHS[i] / totalLength) * scaleFactor;
        chrPositions.push({
            start: currentPos,
            end: currentPos + chrFrac,
            lengthFrac: chrFrac
        });
        currentPos += chrFrac;
        if (i < CHR_COUNT - 1) currentPos += GAP * scaleFactor;
    }

    const normalizePosition = (chrIndex, pos) => {
        const chrStartPos = chrPositions[chrIndex].start;
        const chrLen = CHROMOSOME_LENGTHS[chrIndex];
        const spacing = chrLen * 0.08;
        const fractionWithinChr = pos / (chrLen + spacing);
        return chrStartPos + fractionWithinChr * chrPositions[chrIndex].lengthFrac;
    };

    const calculateChromosomePositions = () => chrPositions.map(pos => pos.start + pos.lengthFrac / 2);

    useEffect(() => {
        const fetchLeadSNPs = async () => {
            try {
                const response = await fetch(`/api/getLeadVariants`);
                if (!response.ok) throw new Error('Failed to fetch lead SNPs');
                const data = await response.json();
                const filteredSNPs = data.filter(snp => 
                    snp.trait.name === phenoId && snp.cohort === selectedCohort
                );
                setLeadSNPs(filteredSNPs);
            } catch (error) {
                console.error('Error fetching lead SNPs:', error);
            }
        };
        fetchLeadSNPs();
    }, [phenoId, selectedCohort]);

    const generateYAxisConfig = (maxValue) => {
        let tickInterval, maxRange;
        if (maxValue <= 10) {
            tickInterval = 2;
            maxRange = 10;
        } else if (maxValue <= 50) {
            tickInterval = 10;
            maxRange = 50;
        } else if (maxValue <= 100) {
            tickInterval = 20;
            maxRange = 100;
        } else if (maxValue <= 200) {
            tickInterval = 50;
            maxRange = 200;
        } else if (maxValue <= 500) {
            tickInterval = 100;
            maxRange = 500;
        } else {
            tickInterval = 100; // Scale up in steps of 100 for very high values
            maxRange = Math.ceil(maxValue / 100) * 100; // Round up to nearest 100
        }

        const ticks = [];
        for (let i = 0; i <= maxRange; i += tickInterval) ticks.push(i);

        return { ticks, maxRange, tickInterval };
    };

    useEffect(() => {
        const allYValues = [...stat, ...dyn].flatMap(d => d.y.filter(y => !isNaN(y) && y !== Infinity));
        const maxYValue = allYValues.length > 0 ? Math.max(...allYValues) : 0;
        const maxLeadSNPLog10p = leadSNPs.reduce((max, snp) => 
            Math.max(max, parseFloat(snp.lead_snp?.log10p) || 0), 0
        );
        const absoluteMaxY = Math.max(maxYValue, maxLeadSNPLog10p, threshold || 0);

        console.log(`Max -log10(p) from data: ${maxYValue}, from lead SNPs: ${maxLeadSNPLog10p}, absolute max: ${absoluteMaxY}`);

        const { ticks, maxRange } = generateYAxisConfig(absoluteMaxY);
        const xAxisTicks = calculateChromosomePositions();
        const xAxisLabels = Array.from({ length: CHR_COUNT }, (_, i) => (i + 1).toString());

        const minLogPThreshold = filterMinPValue ? -Math.log10(parseFloat(filterMinPValue)) : 0;

        const shapes = [];
        if (threshold) {
            shapes.push({
                type: 'line',
                xref: 'paper',
                yref: 'y',
                x0: 0,
                x1: 1,
                y0: threshold,
                y1: threshold,
                line: { color: 'rgb(255, 0, 0)', width: 2, dash: 'dash' }
            });
        }
        shapes.push({
            type: 'rect',
            xref: 'paper',
            yref: 'y',
            x0: 0,
            x1: 1,
            y0: 0,
            y1: minLogPThreshold,
            fillcolor: 'rgba(200, 200, 200, 0.3)',
            line: { width: 0 },
            layer: 'below'
        });

        setLayout({
            autosize: true,
            height: 600,
            paper_bgcolor: 'white',
            plot_bgcolor: 'white',
            showlegend: false,
            xaxis: {
                title: 'Chromosome',
                titlefont: { size: 14 },
                tickmode: 'array',
                tickvals: xAxisTicks,
                ticktext: xAxisLabels,
                showgrid: false,
                zeroline: false,
                showline: true,
                linewidth: 1,
                range: [-0.01, 1.05],
                fixedrange: true
            },
            yaxis: {
                title: '-log₁₀(p)',
                titlefont: { size: 14 },
                showgrid: false,
                zeroline: false,
                showline: true,
                linewidth: 1,
                tickmode: 'array',
                tickvals: ticks,
                ticktext: ticks.map(String),
                range: [0, maxRange * 1.05], // Ensure full range is visible
                fixedrange: true
            },
            margin: { l: 60, r: 40, t: 20, b: 40 },
            shapes
        });

    }, [stat, dyn, threshold, leadSNPs, selectedCohort, selectedStudy, filterMinPValue]);

    const prepareRegularData = () => {
        const regularTraces = [];
        for (let chrIndex = 0; chrIndex < CHR_COUNT; chrIndex++) {
            const chrData = [...stat, ...dyn].filter(d => d.chr === (chrIndex + 1));
            chrData.forEach(d => {
                regularTraces.push({
                    x: d.pos.map(p => normalizePosition(chrIndex, p)),
                    y: d.y, // Use raw log10p values directly
                    type: 'scattergl',
                    mode: 'markers',
                    marker: { 
                        color: ALTERNATING_COLORS[chrIndex % 2],
                        size: 3.5,
                        opacity: 1
                    },
                    hoverinfo: 'text',
                    text: d.x.map((xVal, i) => {
                        const snpID = d.SNP_ID?.[i] || 'N/A';
                        const posVal = d.pos?.[i] || 'N/A';
                        const log10p = d.y[i];
                        return (
                            `SNP_ID: ${snpID}<br>` +
                            `Chromosome: ${chrIndex + 1}<br>` +
                            `Position: ${posVal.toLocaleString()}<br>` +
                            `-log10 p-value: ${log10p.toFixed(2)}<br>` +
                            `P-value: ${Math.pow(10, -log10p).toExponential(2)}`
                        );
                    }),
                    showlegend: false
                });
            });
        }
        return regularTraces;
    };

    const prepareLeadSNPData = () => {
        if (!leadSNPs.length || filterLimit === "None") return null;

        const sortedSNPs = [...leadSNPs].sort((a, b) => 
            parseFloat(b.lead_snp.log10p) - parseFloat(a.lead_snp.log10p)
        );
        const limit = filterLimit === 'all' ? sortedSNPs.length : parseInt(filterLimit);
        const filteredSNPs = sortedSNPs.slice(0, limit);

        const leadSNPTrace = {
            x: [],
            y: [],
            text: [],
            type: 'scattergl',
            mode: 'markers',
            marker: {
                symbol: 'diamond',
                size: 8,
                color: '#000000',
                line: { color: '#FFFFFF', width: 2 },
                opacity: 1
            },
            hoverinfo: 'text',
            showlegend: false,
            name: `Lead SNPs (${selectedCohort}) - Top ${filterLimit === 'all' ? 'All' : filterLimit}`
        };

        filteredSNPs.forEach(snp => {
            const chr = parseInt(snp.lead_snp.position.chromosome, 10) - 1;
            const pos = parseInt(snp.lead_snp.position.position, 10);
            const log10p = parseFloat(snp.lead_snp.log10p);
            const normalizedPos = normalizePosition(chr, pos);
            leadSNPTrace.x.push(normalizedPos);
            leadSNPTrace.y.push(log10p);
            leadSNPTrace.text.push(
                `Lead SNP: ${snp.lead_snp.rsid}<br>` +
                `Chromosome: ${chr + 1}<br>` +
                `Position: ${pos.toLocaleString()}<br>` +
                `-log10 p-value: ${log10p.toFixed(2)}<br>` +
                `Population: ${snp.cohort}`
            );
        });

        return leadSNPTrace;
    };

    const extractValue = (textParts, key) => {
        const part = textParts.find(p => p.startsWith(`${key}:`));
        return part ? part.split(': ')[1] : null;
    };

    const handleClick = (event) => {
        const point = event.points[0];
        if (point?.text) {
            const textParts = point.text.split('<br>');
            const snpData = {
                SNP_ID: extractValue(textParts, 'SNP_ID') || extractValue(textParts, 'Lead SNP'),
                chromosome: extractValue(textParts, 'Chromosome'),
                position: extractValue(textParts, 'Position')?.replace(/,/g, ''),
                pvalue: extractValue(textParts, 'P-value') || extractValue(textParts, '-log10 p-value')
            };
            if (snpData.SNP_ID && snpData.chromosome && snpData.position) {
                onSNPClick(snpData);
            }
        }
    };

    const leadSNPTrace = prepareLeadSNPData();
    const regularData = prepareRegularData();
    const allData = leadSNPTrace ? [...regularData, leadSNPTrace] : regularData;

    return (
        <div className="w-full h-[600px]">
            <Plot
                data={allData}
                layout={layout}
                config={{ 
                    responsive: true,
                    displayModeBar: false,
                    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
                    displaylogo: false,
                    scrollZoom: false
                }}
                onClick={handleClick}
                style={{ width: '100%', height: '100%' }}
                useResizeHandler={true}
            />
        </div>
    );
};