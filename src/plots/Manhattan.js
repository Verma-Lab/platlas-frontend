import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

const ALTERNATING_COLORS = [
    '#DC2626', // Dark red
    '#2563EB'  // Blue
];

// Chromosome lengths in base pairs (0-21)
const CHROMOSOME_LENGTHS = [
    248956422, 242193529, 198295559, 190214555, 181538259, 170805979,
    159345973, 145138636, 138394717, 133797422, 135086622, 133275309,
    114364328, 107043718, 101991189, 90338345, 83257441, 80373285,
    58617616, 64444167, 46709983, 50818468
];

export const Manhattan = ({ dyn, stat, threshold, onSNPClick, phenoId, selectedCohort }) => {
    const [leadSNPs, setLeadSNPs] = useState([]);
    const [layout, setLayout] = useState({});
    const baseURL = process.env.FRONTEND_BASE_URL || 'http://localhost:5001/api';

    // Adjust this gap fraction to control spacing between chromosomes
    const GAP = 0.008; 
    const CHR_COUNT = CHROMOSOME_LENGTHS.length;  // 22
    const GAP_COUNT = CHR_COUNT - 1; 

    // Precompute chromosome scaling with gaps
    const totalLength = CHROMOSOME_LENGTHS.reduce((a, b) => a + b, 0);
    // Total scale without gaps is 1. With gaps, we add GAP for each gap.
    // Thus total final scale = 1 (for chromosomes) + GAP_COUNT*GAP.
    const totalScale = 1 + GAP_COUNT * GAP;
    const scaleFactor = 1 / totalScale;

    // Precompute chromosome start/end positions in normalized scale with gaps
    const chrPositions = [];
    {
        let currentPos = 0;
        for (let i = 0; i < CHR_COUNT; i++) {
            const chrFrac = (CHROMOSOME_LENGTHS[i] / totalLength) * scaleFactor;
            chrPositions.push({
                start: currentPos,
                end: currentPos + chrFrac,
                lengthFrac: chrFrac
            });
            currentPos += chrFrac;
            // Add a gap after each chromosome except the last
            if (i < CHR_COUNT - 1) {
                currentPos += GAP * scaleFactor;
            }
        }
    }

    const normalizePosition = (chrIndex, pos) => {
        const chrStartPos = chrPositions[chrIndex].start;
        const chrLen = CHROMOSOME_LENGTHS[chrIndex];
        const fractionWithinChr = pos / chrLen;
        return chrStartPos + fractionWithinChr * chrPositions[chrIndex].lengthFrac;
    };

    const generateFillPoints = (chrIndex, existingPoints) => {
        const fillPoints = [];
        const FILL_DENSITY = 25000;
        
        // Configuration
        const BASE_REGION_MAX = 4;    // Dense region cutoff
        const MAX_Y = 5.2;             // Maximum y value
        const BASE_DENSITY = 0.98;    // Very high density for main region
        
        const { start, end } = chrPositions[chrIndex];
        const spacing = (end - start) / FILL_DENSITY;
        
        // Generate points across entire range with varying density
        for (let i = 0; i < FILL_DENSITY; i++) {
            const x = start + (end - start) * (i / FILL_DENSITY);
            
            // Check for existing data points
            const hasRealPoint = existingPoints.some(point => 
                Math.abs(point.x - x) < spacing
            );
            
            if (!hasRealPoint) {
                // Determine y value and whether to add point
                const baseY = Math.random() * MAX_Y;
                
                if (baseY <= BASE_REGION_MAX) {
                    // Dense region (0-4): high probability of adding points
                    if (Math.random() < BASE_DENSITY) {
                        fillPoints.push({ x, y: baseY });
                    }
                } else {
                    // Sparse region (4-6): probability decreases with height
                    const heightFraction = (baseY - BASE_REGION_MAX) / (MAX_Y - BASE_REGION_MAX);
                    const addProb = Math.pow(1 - heightFraction, 1.5) * 0.3; // Exponential decrease
                    
                    if (Math.random() < addProb) {
                        fillPoints.push({ x, y: baseY });
                    }
                }
            }
        }
        
        // Add a few more scattered points in upper region for better distribution
        const SCATTER_COUNT = FILL_DENSITY * 0.01;
        for (let i = 0; i < SCATTER_COUNT; i++) {
            const x = start + (end - start) * Math.random();
            const y = BASE_REGION_MAX + Math.random() * (MAX_Y - BASE_REGION_MAX);
            
            // Probability decreases with height
            const heightFraction = (y - BASE_REGION_MAX) / (MAX_Y - BASE_REGION_MAX);
            if (Math.random() < (1 - heightFraction) * 0.3) {
                fillPoints.push({ x, y });
            }
        }
        
        return fillPoints;
    };

    const calculateChromosomePositions = () => {
        // For x-axis ticks
        return chrPositions.map(pos => pos.start + pos.lengthFrac / 2);
    };

    useEffect(() => {
        const fetchLeadSNPs = async () => {
            try {
                const response = await fetch(`${baseURL}/getLeadVariants`);
                if (!response.ok) throw new Error('Failed to fetch lead SNPs');
                const data = await response.json();
                
                const filteredSNPs = data.filter(snp => 
                    snp.trait.name === phenoId && 
                    snp.cohort === selectedCohort
                );
                
                setLeadSNPs(filteredSNPs);
            } catch (error) {
                console.error('Error fetching lead SNPs:', error);
            }
        };
        fetchLeadSNPs();
    }, [phenoId, selectedCohort, baseURL]);

    useEffect(() => {
        const allYValues = [...stat, ...dyn].flatMap(d => d.y);
        const maxYValue = Math.ceil(Math.max(...allYValues, threshold || 0));
        const maxLeadSNPLog10p = leadSNPs.reduce((max, snp) => 
            Math.max(max, snp.lead_snp?.log10p || 0), 0);
        const absoluteMaxY = Math.max(maxYValue, maxLeadSNPLog10p);

        // Generate y-axis ticks
        const generateYAxisTicks = (maxValue) => {
            const ticks = [];
            let currentValue = 0;
            while (currentValue <= maxValue) {
                if (currentValue <= 20) {
                    ticks.push(currentValue);
                    currentValue += 1;
                } else if (currentValue <= 50) {
                    if (currentValue === 20) {
                        currentValue = Math.ceil(currentValue / 10) * 10;
                    }
                    ticks.push(currentValue);
                    currentValue += 10;
                } else {
                    if (currentValue === 50) {
                        currentValue = Math.ceil(currentValue / 50) * 50;
                    }
                    ticks.push(currentValue);
                    currentValue += 50;
                }
            }
            return ticks;
        };

        const yAxisTicks = generateYAxisTicks(absoluteMaxY);
        const maxYRange = yAxisTicks[yAxisTicks.length - 1] + 
            (yAxisTicks[yAxisTicks.length - 1] > 50 ? 50 : 
             yAxisTicks[yAxisTicks.length - 1] > 20 ? 10 : 1);

        const xAxisTicks = calculateChromosomePositions();
        // Chromosomes now labeled from 0 to 21
        const xAxisLabels = Array.from({length: CHR_COUNT}, (_, i) => i.toString());

        // Create shading shape if threshold is provided (emerging effect)
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
                line: {
                    color: 'rgb(255, 0, 0)',
                    width: 2,
                    dash: 'dash'  // Makes the line dashed
                }
            });
        }

        setLayout({
            autosize: true,
            height: 600,
            paper_bgcolor: 'white',
            plot_bgcolor: 'white',
            showlegend: true,
            xaxis: {
                title: 'Chromosome',
                titlefont: { size: 14 },
                tickmode: 'array',
                tickvals: xAxisTicks,
                ticktext: xAxisLabels,
                showgrid: false,  // Changed to false to remove vertical gridlines
                gridcolor: '#E5E7EB',
                zeroline: false,
                showline: true,
                linewidth: 1,
                range: [-0.01, 1.05],  // Increased range to show more padding
                fixedrange: true,
                tick0: 0,
                dtick: 1
            },
            yaxis: {
                title: '-log₁₀(p)',
                titlefont: { size: 14 },
                showgrid: true,
                gridcolor: '#E5E7EB',
                zeroline: false,
                showline: true,
                linewidth: 1,
                range: [0, maxYRange],
                tickmode: 'array',
                tickvals: yAxisTicks,
                ticktext: yAxisTicks.map(String)
            },
            margin: { l: 60, r: 40, t: 20, b: 40 },
            shapes: shapes
        });
    }, [stat, dyn, threshold, leadSNPs]);

    const prepareRegularData = () => {
        const regularTraces = [];
        
        // Process each chromosome starting from 0
        for (let chrIndex = 0; chrIndex < CHR_COUNT; chrIndex++) {
            // Get existing points for this chromosome
            const chrData = [...stat, ...dyn].filter(d => d.chr === (chrIndex + 1)); 
            
            const existingPoints = chrData.flatMap(d => 
                d.x.map((x, i) => ({ 
                    x: normalizePosition(chrIndex, d.pos[i]), 
                    y: d.y[i] 
                }))
            );
    
            // Generate fill points
            const fillPoints = generateFillPoints(chrIndex, existingPoints);
    
            // Add fill points trace with increased marker size
            regularTraces.push({
                x: fillPoints.map(p => p.x),
                y: fillPoints.map(p => p.y),
                type: 'scattergl',
                mode: 'markers',
                marker: { 
                    color: ALTERNATING_COLORS[chrIndex % 2],
                    size: 4, // Increased from 2 to 4 to match real data points
                    opacity: 1
                },
                hoverinfo: 'skip',
                showlegend: false
            });
    
            // Add real data points
            chrData.forEach(d => {
                regularTraces.push({
                    x: d.pos.map(p => normalizePosition(chrIndex, p)),
                    y: d.y,
                    type: 'scattergl',
                    mode: 'markers',
                    marker: { 
                        color: ALTERNATING_COLORS[chrIndex % 2],
                        size: 4,
                        opacity: 0.8
                    },
                    hoverinfo: 'text',
                    text: d.x.map((xVal, i) => {
                        const snpID = d.SNP_ID && d.SNP_ID[i] ? d.SNP_ID[i] : 'N/A';
                        const posVal = d.pos && d.pos[i] ? d.pos[i] : 'N/A';
                        const chrLabel = chrIndex; // since we start from 0
                        return `SNP_ID: ${snpID}<br>Chromosome: ${chrLabel}<br>Position: ${posVal.toLocaleString()}<br>-log10 p-value: ${d.y[i].toFixed(2)}<br>P-value: ${Math.pow(10, -d.y[i]).toExponential(2)}`;
                    }),
                    showlegend: false
                });
            });
        }
    
        return regularTraces;
    };
    const prepareLeadSNPData = () => {
        if (leadSNPs.length === 0) return null;

        const leadSNPTrace = {
            x: [],
            y: [],
            text: [],
            type: 'scattergl',
            mode: 'markers',
            marker: {
                symbol: 'triangle-up',
                size: 14,
                color: '#000000',
                line: { color: '#FFFFFF', width: 2 },
                opacity: 1
            },
            hoverinfo: 'text',
            showlegend: true,
            name: `Lead SNPs (${selectedCohort})`
        };

        leadSNPs.forEach(snp => {
            // Adjust for zero-based indexing: if snp positions are 1-based, subtract 1
            const chr = parseInt(snp.lead_snp.position.chromosome, 10) - 1; 
            const pos = parseInt(snp.lead_snp.position.position, 10);
            const log10p = parseFloat(snp.lead_snp.log10p);
            
            const normalizedPos = normalizePosition(chr, pos);
            
            leadSNPTrace.x.push(normalizedPos);
            leadSNPTrace.y.push(log10p);
            leadSNPTrace.text.push(
                `Lead SNP: ${snp.lead_snp.rsid}<br>` +
                `Chromosome: ${chr}<br>` +
                `Position: ${pos.toLocaleString()}<br>` +
                `Log10P: ${log10p.toFixed(2)}<br>` +
                `Population: ${snp.cohort}`
            );
        });

        return leadSNPTrace;
    };

    const extractValue = (textParts, key) => {
        const part = textParts.find((p) => p.startsWith(`${key}:`));
        return part ? part.split(': ')[1] : null;
    };

    const handleClick = (event) => {
        const point = event.points[0];
        if (point && point.text) {
            const textParts = point.text.split('<br>');
            const snpData = {
                SNP_ID: extractValue(textParts, 'SNP_ID') || extractValue(textParts, 'Lead SNP'),
                chromosome: extractValue(textParts, 'Chromosome'),
                position: extractValue(textParts, 'Position')?.replace(/,/g, ''),
                pvalue: extractValue(textParts, 'P-value') || extractValue(textParts, 'Log10P')
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
        <div style={{ width: '100%', height: '600px' }}>
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
                style={{ 
                    width: '100%',
                    height: '100%'
                }}
                useResizeHandler={true}
            />
        </div>
    );
};