// import React, { useState, useEffect } from 'react';
// import Plot from 'react-plotly.js';

// const ALTERNATING_COLORS = [
//     '#DC2626', // Dark red
//     '#2563EB'  // Blue
// ];

// // Chromosome lengths in base pairs (0-21)
// const CHROMOSOME_LENGTHS = [
//     248956422, 242193529, 198295559, 190214555, 181538259, 170805979,
//     159345973, 145138636, 138394717, 133797422, 135086622, 133275309,
//     114364328, 107043718, 101991189, 90338345, 83257441, 80373285,
//     58617616, 64444167, 46709983, 50818468
// ];

// export const Manhattan = ({ dyn, stat, threshold, onSNPClick, phenoId, selectedCohort }) => {
//     const [leadSNPs, setLeadSNPs] = useState([]);
//     const [layout, setLayout] = useState({});
//     const baseURL = process.env.FRONTEND_BASE_URL || 'http://localhost:5001/api';

//     // Adjust this gap fraction to control spacing between chromosomes
//     const GAP = 0.008; 
//     const CHR_COUNT = CHROMOSOME_LENGTHS.length;  // 22
//     const GAP_COUNT = CHR_COUNT - 1; 

//     // Precompute chromosome scaling with gaps
//     const totalLength = CHROMOSOME_LENGTHS.reduce((a, b) => a + b, 0);
//     // Total scale without gaps is 1. With gaps, we add GAP for each gap.
//     // Thus total final scale = 1 (for chromosomes) + GAP_COUNT*GAP.
//     const totalScale = 1 + GAP_COUNT * GAP;
//     const scaleFactor = 1 / totalScale;

//     // Precompute chromosome start/end positions in normalized scale with gaps
//     const chrPositions = [];
//     {
//         let currentPos = 0;
//         for (let i = 0; i < CHR_COUNT; i++) {
//             const chrFrac = (CHROMOSOME_LENGTHS[i] / totalLength) * scaleFactor;
//             chrPositions.push({
//                 start: currentPos,
//                 end: currentPos + chrFrac,
//                 lengthFrac: chrFrac
//             });
//             currentPos += chrFrac;
//             // Add a gap after each chromosome except the last
//             if (i < CHR_COUNT - 1) {
//                 currentPos += GAP * scaleFactor;
//             }
//         }
//     }

//     const normalizePosition = (chrIndex, pos) => {
//         const chrStartPos = chrPositions[chrIndex].start;
//         const chrLen = CHROMOSOME_LENGTHS[chrIndex];
//         const fractionWithinChr = pos / chrLen;
//         return chrStartPos + fractionWithinChr * chrPositions[chrIndex].lengthFrac;
//     };

//     const generateFillPoints = (chrIndex, existingPoints) => {
//         const fillPoints = [];
//         const FILL_DENSITY = 25000;
        
//         // Configuration
//         const BASE_REGION_MAX = 4;    // Dense region cutoff
//         const MAX_Y = 5.2;             // Maximum y value
//         const BASE_DENSITY = 0.98;    // Very high density for main region
        
//         const { start, end } = chrPositions[chrIndex];
//         const spacing = (end - start) / FILL_DENSITY;
        
//         // Generate points across entire range with varying density
//         for (let i = 0; i < FILL_DENSITY; i++) {
//             const x = start + (end - start) * (i / FILL_DENSITY);
            
//             // Check for existing data points
//             const hasRealPoint = existingPoints.some(point => 
//                 Math.abs(point.x - x) < spacing
//             );
            
//             if (!hasRealPoint) {
//                 // Determine y value and whether to add point
//                 const baseY = Math.random() * MAX_Y;
                
//                 if (baseY <= BASE_REGION_MAX) {
//                     // Dense region (0-4): high probability of adding points
//                     if (Math.random() < BASE_DENSITY) {
//                         fillPoints.push({ x, y: baseY });
//                     }
//                 } else {
//                     // Sparse region (4-6): probability decreases with height
//                     const heightFraction = (baseY - BASE_REGION_MAX) / (MAX_Y - BASE_REGION_MAX);
//                     const addProb = Math.pow(1 - heightFraction, 1.5) * 0.3; // Exponential decrease
                    
//                     if (Math.random() < addProb) {
//                         fillPoints.push({ x, y: baseY });
//                     }
//                 }
//             }
//         }
        
//         // Add a few more scattered points in upper region for better distribution
//         const SCATTER_COUNT = FILL_DENSITY * 0.01;
//         for (let i = 0; i < SCATTER_COUNT; i++) {
//             const x = start + (end - start) * Math.random();
//             const y = BASE_REGION_MAX + Math.random() * (MAX_Y - BASE_REGION_MAX);
            
//             // Probability decreases with height
//             const heightFraction = (y - BASE_REGION_MAX) / (MAX_Y - BASE_REGION_MAX);
//             if (Math.random() < (1 - heightFraction) * 0.3) {
//                 fillPoints.push({ x, y });
//             }
//         }
        
//         return fillPoints;
//     };

//     const calculateChromosomePositions = () => {
//         // For x-axis ticks
//         return chrPositions.map(pos => pos.start + pos.lengthFrac / 2);
//     };

//     useEffect(() => {
//         const fetchLeadSNPs = async () => {
//             try {
//                 const response = await fetch(`${baseURL}/getLeadVariants`);
//                 if (!response.ok) throw new Error('Failed to fetch lead SNPs');
//                 const data = await response.json();
                
//                 const filteredSNPs = data.filter(snp => 
//                     snp.trait.name === phenoId && 
//                     snp.cohort === selectedCohort
//                 );
                
//                 setLeadSNPs(filteredSNPs);
//             } catch (error) {
//                 console.error('Error fetching lead SNPs:', error);
//             }
//         };
//         fetchLeadSNPs();
//     }, [phenoId, selectedCohort, baseURL]);

//     const transformYValue = (value) => {
//         if (value <= 20) return value;
//         if (value <= 50) return 20 + (value - 20) / 10;
//         return 23 + (value - 50) / 50;
//     };

//     // Function to generate tick configurations
//     const generateYAxisConfig = (maxValue) => {
//         const ticks = [];
//         const tickPositions = [];
//         let currentValue = 0;
        
//         // Up to 20 (increment by 1)
//         while (currentValue <= Math.min(20, maxValue)) {
//             ticks.push(currentValue);
//             tickPositions.push(transformYValue(currentValue));
//             currentValue += 1;
//         }
        
//         // From 30 to 50 (increment by 10)
//         if (maxValue > 20) {
//             currentValue = 30;
//             while (currentValue <= Math.min(50, maxValue)) {
//                 ticks.push(currentValue);
//                 tickPositions.push(transformYValue(currentValue));
//                 currentValue += 10;
//             }
//         }
        
//         // Above 50 (increment by 50)
//         if (maxValue > 50) {
//             currentValue = 100;
//             while (currentValue <= maxValue) {
//                 ticks.push(currentValue);
//                 tickPositions.push(transformYValue(currentValue));
//                 currentValue += 50;
//             }
//         }
        
//         return { ticks, tickPositions };
//     };

//     // Transform the data points
//     const transformData = (data) => {
//         return data.map(d => ({
//             ...d,
//             y: d.y.map(y => transformYValue(y))
//         }));
//     };

//     useEffect(() => {
//         const allYValues = [...stat, ...dyn].flatMap(d => d.y);
//         const maxYValue = Math.ceil(Math.max(...allYValues, threshold || 0));
//         const maxLeadSNPLog10p = leadSNPs.reduce((max, snp) => 
//             Math.max(max, snp.lead_snp?.log10p || 0), 0);
//         const absoluteMaxY = Math.max(maxYValue, maxLeadSNPLog10p);

//         const { ticks, tickPositions } = generateYAxisConfig(absoluteMaxY);
        
//         // Transform threshold if it exists
//         const transformedThreshold = threshold ? transformYValue(threshold) : null;

//         const xAxisTicks = calculateChromosomePositions();
//         const xAxisLabels = Array.from({length: CHR_COUNT}, (_, i) => i.toString());

//         const shapes = threshold ? [{
//             type: 'line',
//             xref: 'paper',
//             yref: 'y',
//             x0: 0,
//             x1: 1,
//             y0: transformedThreshold,
//             y1: transformedThreshold,
//             line: {
//                 color: 'rgb(255, 0, 0)',
//                 width: 2,
//                 dash: 'dash'
//             }
//         }] : [];

//         setLayout({
//             autosize: true,
//             height: 600,
//             paper_bgcolor: 'white',
//             plot_bgcolor: 'white',
//             showlegend: true,
//             xaxis: {
//                 title: 'Chromosome',
//                 titlefont: { size: 14 },
//                 tickmode: 'array',
//                 tickvals: xAxisTicks,
//                 ticktext: xAxisLabels,
//                 showgrid: false,
//                 gridcolor: '#E5E7EB',
//                 zeroline: false,
//                 showline: true,
//                 linewidth: 1,
//                 range: [-0.01, 1.05],
//                 fixedrange: true
//             },
//             yaxis: {
//                 title: '-log₁₀(p)',
//                 titlefont: { size: 14 },
//                 showgrid: true,
//                 gridcolor: '#E5E7EB',
//                 zeroline: false,
//                 showline: true,
//                 linewidth: 1,
//                 tickmode: 'array',
//                 tickvals: tickPositions,
//                 ticktext: ticks.map(String),
//                 range: [-1, transformYValue(absoluteMaxY) + 1]
//             },
//             margin: { l: 60, r: 40, t: 20, b: 40 },
//             shapes: shapes
//         });
//     }, [stat, dyn, threshold, leadSNPs]);

//     const prepareRegularData = () => {
//         const regularTraces = [];
        
//         // Process each chromosome
//         for (let chrIndex = 0; chrIndex < CHR_COUNT; chrIndex++) {
//             // Get existing points for this chromosome
//             const chrData = [...stat, ...dyn].filter(d => d.chr === (chrIndex + 1)); 
            
//             const existingPoints = chrData.flatMap(d => 
//                 d.x.map((x, i) => ({ 
//                     x: normalizePosition(chrIndex, d.pos[i]), 
//                     y: transformYValue(d.y[i]) 
//                 }))
//             );
    
//             // Generate fill points
//             const fillPoints = generateFillPoints(chrIndex, existingPoints);
    
//             // Add fill points trace
//             regularTraces.push({
//                 x: fillPoints.map(p => p.x),
//                 y: fillPoints.map(p => transformYValue(p.y)),
//                 type: 'scattergl',
//                 mode: 'markers',
//                 marker: { 
//                     color: ALTERNATING_COLORS[chrIndex % 2],
//                     size: 4,
//                     opacity: 0.6
//                 },
//                 hoverinfo: 'skip',
//                 showlegend: false
//             });
    
//             // Add real data points
//             chrData.forEach(d => {
//                 regularTraces.push({
//                     x: d.pos.map(p => normalizePosition(chrIndex, p)),
//                     y: d.y.map(y => transformYValue(y)),
//                     type: 'scattergl',
//                     mode: 'markers',
//                     marker: { 
//                         color: ALTERNATING_COLORS[chrIndex % 2],
//                         size: 4,
//                         opacity: 0.8
//                     },
//                     hoverinfo: 'text',
//                     text: d.x.map((xVal, i) => {
//                         const snpID = d.SNP_ID && d.SNP_ID[i] ? d.SNP_ID[i] : 'N/A';
//                         const posVal = d.pos && d.pos[i] ? d.pos[i] : 'N/A';
//                         const originalY = d.y[i];
//                         return `SNP_ID: ${snpID}<br>` +
//                                `Chromosome: ${chrIndex}<br>` +
//                                `Position: ${posVal.toLocaleString()}<br>` +
//                                `-log10 p-value: ${originalY.toFixed(2)}<br>` +
//                                `P-value: ${Math.pow(10, -originalY).toExponential(2)}`;
//                     }),
//                     showlegend: false
//                 });
//             });
//         }
    
//         return regularTraces;
//     };
//     const prepareLeadSNPData = () => {
//         if (!leadSNPs.length) return null;
    
//         const leadSNPTrace = {
//             x: [],
//             y: [],
//             text: [],
//             type: 'scattergl',
//             mode: 'markers',
//             marker: {
//                 symbol: 'triangle-up',
//                 size: 14,
//                 color: '#000000',
//                 line: { color: '#FFFFFF', width: 2 },
//                 opacity: 1
//             },
//             hoverinfo: 'text',
//             showlegend: true,
//             name: `Lead SNPs (${selectedCohort})`
//         };
    
//         leadSNPs.forEach(snp => {
//             // Adjust for zero-based indexing
//             const chr = parseInt(snp.lead_snp.position.chromosome, 10) - 1;
//             const pos = parseInt(snp.lead_snp.position.position, 10);
//             const log10p = parseFloat(snp.lead_snp.log10p);
            
//             const normalizedPos = normalizePosition(chr, pos);
//             const transformedY = transformYValue(log10p);
            
//             leadSNPTrace.x.push(normalizedPos);
//             leadSNPTrace.y.push(transformedY);
//             leadSNPTrace.text.push(
//                 `Lead SNP: ${snp.lead_snp.rsid}<br>` +
//                 `Chromosome: ${chr}<br>` +
//                 `Position: ${pos.toLocaleString()}<br>` +
//                 `Log10P: ${log10p.toFixed(2)}<br>` +
//                 `Population: ${snp.cohort}`
//             );
//         });
    
//         return leadSNPTrace;
//     };

//     const extractValue = (textParts, key) => {
//         const part = textParts.find((p) => p.startsWith(`${key}:`));
//         return part ? part.split(': ')[1] : null;
//     };

//     const handleClick = (event) => {
//         const point = event.points[0];
//         if (point && point.text) {
//             const textParts = point.text.split('<br>');
//             const snpData = {
//                 SNP_ID: extractValue(textParts, 'SNP_ID') || extractValue(textParts, 'Lead SNP'),
//                 chromosome: extractValue(textParts, 'Chromosome'),
//                 position: extractValue(textParts, 'Position')?.replace(/,/g, ''),
//                 pvalue: extractValue(textParts, 'P-value') || extractValue(textParts, 'Log10P')
//             };

//             if (snpData.SNP_ID && snpData.chromosome && snpData.position) {
//                 onSNPClick(snpData);
//             }
//         }
//     };

//     const leadSNPTrace = prepareLeadSNPData();
//     const regularData = prepareRegularData();
//     const allData = leadSNPTrace ? [...regularData, leadSNPTrace] : regularData;

//     return (
//         <div style={{ width: '100%', height: '600px' }}>
//             <Plot
//                 data={allData}
//                 layout={layout}
//                 config={{ 
//                     responsive: true,
//                     displayModeBar: false,
//                     modeBarButtonsToRemove: ['lasso2d', 'select2d'],
//                     displaylogo: false,
//                     scrollZoom: false
//                 }}
//                 onClick={handleClick}
//                 style={{ 
//                     width: '100%',
//                     height: '100%'
//                 }}
//                 useResizeHandler={true}
//             />
//         </div>
//     );
// };




// // import React, { useState, useEffect } from 'react';
// // import Plot from 'react-plotly.js';

// // const ALTERNATING_COLORS = [
// //     '#DC2626', // Dark red
// //     '#2563EB'  // Blue
// // ];

// // // Chromosome lengths in base pairs (0-21)
// // const CHROMOSOME_LENGTHS = [
// //     248956422, 242193529, 198295559, 190214555, 181538259, 170805979,
// //     159345973, 145138636, 138394717, 133797422, 135086622, 133275309,
// //     114364328, 107043718, 101991189, 90338345, 83257441, 80373285,
// //     58617616, 64444167, 46709983, 50818468
// // ];

// // export const Manhattan = ({ dyn, stat, threshold, onSNPClick, phenoId, selectedCohort }) => {
// //     const [leadSNPs, setLeadSNPs] = useState([]);
// //     const [layout, setLayout] = useState({});
// //     const baseURL = process.env.FRONTEND_BASE_URL || 'http://localhost:5001/api';

// //     // Adjust this gap fraction to control spacing between chromosomes
// //     const GAP = 0.008; 
// //     const CHR_COUNT = CHROMOSOME_LENGTHS.length;  // 22
// //     const GAP_COUNT = CHR_COUNT - 1; 

// //     // Precompute chromosome scaling with gaps
// //     const totalLength = CHROMOSOME_LENGTHS.reduce((a, b) => a + b, 0);
// //     // Total scale without gaps is 1. With gaps, we add GAP for each gap.
// //     // Thus total final scale = 1 (for chromosomes) + GAP_COUNT*GAP.
// //     const totalScale = 1 + GAP_COUNT * GAP;
// //     const scaleFactor = 1 / totalScale;

// //     // Precompute chromosome start/end positions in normalized scale with gaps
// //     const chrPositions = [];
// //     {
// //         let currentPos = 0;
// //         for (let i = 0; i < CHR_COUNT; i++) {
// //             const chrFrac = (CHROMOSOME_LENGTHS[i] / totalLength) * scaleFactor;
// //             chrPositions.push({
// //                 start: currentPos,
// //                 end: currentPos + chrFrac,
// //                 lengthFrac: chrFrac
// //             });
// //             currentPos += chrFrac;
// //             // Add a gap after each chromosome except the last
// //             if (i < CHR_COUNT - 1) {
// //                 currentPos += GAP * scaleFactor;
// //             }
// //         }
// //     }

// //     const normalizePosition = (chrIndex, pos) => {
// //         const chrStartPos = chrPositions[chrIndex].start;
// //         const chrLen = CHROMOSOME_LENGTHS[chrIndex];
// //         const fractionWithinChr = pos / chrLen;
// //         return chrStartPos + fractionWithinChr * chrPositions[chrIndex].lengthFrac;
// //     };

// //     const generateFillPoints = (chrIndex, existingPoints) => {
// //         const fillPoints = [];
// //         const FILL_DENSITY = 25000;
        
// //         // Configuration
// //         const BASE_REGION_MAX = 4;    // Dense region cutoff
// //         const MAX_Y = 5.2;             // Maximum y value
// //         const BASE_DENSITY = 0.98;    // Very high density for main region
        
// //         const { start, end } = chrPositions[chrIndex];
// //         const spacing = (end - start) / FILL_DENSITY;
        
// //         // Generate points across entire range with varying density
// //         for (let i = 0; i < FILL_DENSITY; i++) {
// //             const x = start + (end - start) * (i / FILL_DENSITY);
            
// //             // Check for existing data points
// //             const hasRealPoint = existingPoints.some(point => 
// //                 Math.abs(point.x - x) < spacing
// //             );
            
// //             if (!hasRealPoint) {
// //                 // Determine y value and whether to add point
// //                 const baseY = Math.random() * MAX_Y;
                
// //                 if (baseY <= BASE_REGION_MAX) {
// //                     // Dense region (0-4): high probability of adding points
// //                     if (Math.random() < BASE_DENSITY) {
// //                         fillPoints.push({ x, y: baseY });
// //                     }
// //                 } else {
// //                     // Sparse region (4-6): probability decreases with height
// //                     const heightFraction = (baseY - BASE_REGION_MAX) / (MAX_Y - BASE_REGION_MAX);
// //                     const addProb = Math.pow(1 - heightFraction, 1.5) * 0.3; // Exponential decrease
                    
// //                     if (Math.random() < addProb) {
// //                         fillPoints.push({ x, y: baseY });
// //                     }
// //                 }
// //             }
// //         }
        
// //         // Add a few more scattered points in upper region for better distribution
// //         const SCATTER_COUNT = FILL_DENSITY * 0.01;
// //         for (let i = 0; i < SCATTER_COUNT; i++) {
// //             const x = start + (end - start) * Math.random();
// //             const y = BASE_REGION_MAX + Math.random() * (MAX_Y - BASE_REGION_MAX);
            
// //             // Probability decreases with height
// //             const heightFraction = (y - BASE_REGION_MAX) / (MAX_Y - BASE_REGION_MAX);
// //             if (Math.random() < (1 - heightFraction) * 0.3) {
// //                 fillPoints.push({ x, y });
// //             }
// //         }
        
// //         return fillPoints;
// //     };

// //     const calculateChromosomePositions = () => {
// //         // For x-axis ticks
// //         return chrPositions.map(pos => pos.start + pos.lengthFrac / 2);
// //     };

// //     useEffect(() => {
// //         const fetchLeadSNPs = async () => {
// //             try {
// //                 const response = await fetch(`${baseURL}/getLeadVariants`);
// //                 if (!response.ok) throw new Error('Failed to fetch lead SNPs');
// //                 const data = await response.json();
                
// //                 const filteredSNPs = data.filter(snp => 
// //                     snp.trait.name === phenoId && 
// //                     snp.cohort === selectedCohort
// //                 );
                
// //                 setLeadSNPs(filteredSNPs);
// //             } catch (error) {
// //                 console.error('Error fetching lead SNPs:', error);
// //             }
// //         };
// //         fetchLeadSNPs();
// //     }, [phenoId, selectedCohort, baseURL]);

// //     useEffect(() => {
// //         const allYValues = [...stat, ...dyn].flatMap(d => d.y);
// //         const maxYValue = Math.ceil(Math.max(...allYValues, threshold || 0));
// //         const maxLeadSNPLog10p = leadSNPs.reduce((max, snp) => 
// //             Math.max(max, snp.lead_snp?.log10p || 0), 0);
// //         const absoluteMaxY = Math.max(maxYValue, maxLeadSNPLog10p);

// //         // Generate y-axis ticks
// //         const generateYAxisTicks = (maxValue) => {
// //             const ticks = [];
// //             let currentValue = 0;
// //             while (currentValue <= maxValue) {
// //                 if (currentValue <= 20) {
// //                     ticks.push(currentValue);
// //                     currentValue += 1;
// //                 } else if (currentValue <= 50) {
// //                     if (currentValue === 20) {
// //                         currentValue = Math.ceil(currentValue / 10) * 10;
// //                     }
// //                     ticks.push(currentValue);
// //                     currentValue += 10;
// //                 } else {
// //                     if (currentValue === 50) {
// //                         currentValue = Math.ceil(currentValue / 50) * 50;
// //                     }
// //                     ticks.push(currentValue);
// //                     currentValue += 50;
// //                 }
// //             }
// //             return ticks;
// //         };

// //         const yAxisTicks = generateYAxisTicks(absoluteMaxY);
// //         const maxYRange = yAxisTicks[yAxisTicks.length - 1] + 
// //             (yAxisTicks[yAxisTicks.length - 1] > 50 ? 50 : 
// //              yAxisTicks[yAxisTicks.length - 1] > 20 ? 10 : 1);

// //         const xAxisTicks = calculateChromosomePositions();
// //         // Chromosomes now labeled from 0 to 21
// //         const xAxisLabels = Array.from({length: CHR_COUNT}, (_, i) => i.toString());

// //         // Create shading shape if threshold is provided (emerging effect)
// //         const shapes = [];
// //         if (threshold) {
// //             shapes.push({
// //                 type: 'line',
// //                 xref: 'paper',
// //                 yref: 'y',
// //                 x0: 0,
// //                 x1: 1,
// //                 y0: threshold,
// //                 y1: threshold,
// //                 line: {
// //                     color: 'rgb(255, 0, 0)',
// //                     width: 2,
// //                     dash: 'dash'  // Makes the line dashed
// //                 }
// //             });
// //         }

// //         setLayout({
// //             autosize: true,
// //             height: 600,
// //             paper_bgcolor: 'white',
// //             plot_bgcolor: 'white',
// //             showlegend: true,
// //             xaxis: {
// //                 title: 'Chromosome',
// //                 titlefont: { size: 14 },
// //                 tickmode: 'array',
// //                 tickvals: xAxisTicks,
// //                 ticktext: xAxisLabels,
// //                 showgrid: false,  // Changed to false to remove vertical gridlines
// //                 gridcolor: '#E5E7EB',
// //                 zeroline: false,
// //                 showline: true,
// //                 linewidth: 1,
// //                 range: [-0.01, 1.05],  // Increased range to show more padding
// //                 fixedrange: true,
// //                 tick0: 0,
// //                 dtick: 1
// //             },
// //             yaxis: {
// //                 title: '-log₁₀(p)',
// //                 titlefont: { size: 14 },
// //                 showgrid: true,
// //                 gridcolor: '#E5E7EB',
// //                 zeroline: false,
// //                 showline: true,
// //                 linewidth: 1,
// //                 range: [0, maxYRange],
// //                 tickmode: 'array',
// //                 tickvals: yAxisTicks,
// //                 ticktext: yAxisTicks.map(String)
// //             },
// //             margin: { l: 60, r: 40, t: 20, b: 40 },
// //             shapes: shapes
// //         });
// //     }, [stat, dyn, threshold, leadSNPs]);

// //     const prepareRegularData = () => {
// //         const regularTraces = [];
        
// //         // Process each chromosome starting from 0
// //         for (let chrIndex = 0; chrIndex < CHR_COUNT; chrIndex++) {
// //             // Get existing points for this chromosome
// //             const chrData = [...stat, ...dyn].filter(d => d.chr === (chrIndex + 1)); 
            
// //             const existingPoints = chrData.flatMap(d => 
// //                 d.x.map((x, i) => ({ 
// //                     x: normalizePosition(chrIndex, d.pos[i]), 
// //                     y: d.y[i] 
// //                 }))
// //             );
    
// //             // Generate fill points
// //             const fillPoints = generateFillPoints(chrIndex, existingPoints);
    
// //             // Add fill points trace with increased marker size
// //             regularTraces.push({
// //                 x: fillPoints.map(p => p.x),
// //                 y: fillPoints.map(p => p.y),
// //                 type: 'scattergl',
// //                 mode: 'markers',
// //                 marker: { 
// //                     color: ALTERNATING_COLORS[chrIndex % 2],
// //                     size: 4, // Increased from 2 to 4 to match real data points
// //                     opacity: 1
// //                 },
// //                 hoverinfo: 'skip',
// //                 showlegend: false
// //             });
    
// //             // Add real data points
// //             chrData.forEach(d => {
// //                 regularTraces.push({
// //                     x: d.pos.map(p => normalizePosition(chrIndex, p)),
// //                     y: d.y,
// //                     type: 'scattergl',
// //                     mode: 'markers',
// //                     marker: { 
// //                         color: ALTERNATING_COLORS[chrIndex % 2],
// //                         size: 4,
// //                         opacity: 0.8
// //                     },
// //                     hoverinfo: 'text',
// //                     text: d.x.map((xVal, i) => {
// //                         const snpID = d.SNP_ID && d.SNP_ID[i] ? d.SNP_ID[i] : 'N/A';
// //                         const posVal = d.pos && d.pos[i] ? d.pos[i] : 'N/A';
// //                         const chrLabel = chrIndex; // since we start from 0
// //                         return `SNP_ID: ${snpID}<br>Chromosome: ${chrLabel}<br>Position: ${posVal.toLocaleString()}<br>-log10 p-value: ${d.y[i].toFixed(2)}<br>P-value: ${Math.pow(10, -d.y[i]).toExponential(2)}`;
// //                     }),
// //                     showlegend: false
// //                 });
// //             });
// //         }
    
// //         return regularTraces;
// //     };
// //     const prepareLeadSNPData = () => {
// //         if (leadSNPs.length === 0) return null;

// //         const leadSNPTrace = {
// //             x: [],
// //             y: [],
// //             text: [],
// //             type: 'scattergl',
// //             mode: 'markers',
// //             marker: {
// //                 symbol: 'triangle-up',
// //                 size: 14,
// //                 color: '#000000',
// //                 line: { color: '#FFFFFF', width: 2 },
// //                 opacity: 1
// //             },
// //             hoverinfo: 'text',
// //             showlegend: true,
// //             name: `Lead SNPs (${selectedCohort})`
// //         };

// //         leadSNPs.forEach(snp => {
// //             // Adjust for zero-based indexing: if snp positions are 1-based, subtract 1
// //             const chr = parseInt(snp.lead_snp.position.chromosome, 10) - 1; 
// //             const pos = parseInt(snp.lead_snp.position.position, 10);
// //             const log10p = parseFloat(snp.lead_snp.log10p);
            
// //             const normalizedPos = normalizePosition(chr, pos);
            
// //             leadSNPTrace.x.push(normalizedPos);
// //             leadSNPTrace.y.push(log10p);
// //             leadSNPTrace.text.push(
// //                 `Lead SNP: ${snp.lead_snp.rsid}<br>` +
// //                 `Chromosome: ${chr}<br>` +
// //                 `Position: ${pos.toLocaleString()}<br>` +
// //                 `Log10P: ${log10p.toFixed(2)}<br>` +
// //                 `Population: ${snp.cohort}`
// //             );
// //         });

// //         return leadSNPTrace;
// //     };

// //     const extractValue = (textParts, key) => {
// //         const part = textParts.find((p) => p.startsWith(`${key}:`));
// //         return part ? part.split(': ')[1] : null;
// //     };

// //     const handleClick = (event) => {
// //         const point = event.points[0];
// //         if (point && point.text) {
// //             const textParts = point.text.split('<br>');
// //             const snpData = {
// //                 SNP_ID: extractValue(textParts, 'SNP_ID') || extractValue(textParts, 'Lead SNP'),
// //                 chromosome: extractValue(textParts, 'Chromosome'),
// //                 position: extractValue(textParts, 'Position')?.replace(/,/g, ''),
// //                 pvalue: extractValue(textParts, 'P-value') || extractValue(textParts, 'Log10P')
// //             };

// //             if (snpData.SNP_ID && snpData.chromosome && snpData.position) {
// //                 onSNPClick(snpData);
// //             }
// //         }
// //     };

// //     const leadSNPTrace = prepareLeadSNPData();
// //     const regularData = prepareRegularData();
// //     const allData = leadSNPTrace ? [...regularData, leadSNPTrace] : regularData;

// //     return (
// //         <div style={{ width: '100%', height: '600px' }}>
// //             <Plot
// //                 data={allData}
// //                 layout={layout}
// //                 config={{ 
// //                     responsive: true,
// //                     displayModeBar: false,
// //                     modeBarButtonsToRemove: ['lasso2d', 'select2d'],
// //                     displaylogo: false,
// //                     scrollZoom: false
// //                 }}
// //                 onClick={handleClick}
// //                 style={{ 
// //                     width: '100%',
// //                     height: '100%'
// //                 }}
// //                 useResizeHandler={true}
// //             />
// //         </div>
// //     );
// // };

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

export const Manhattan = ({ dyn, stat, threshold, onSNPClick, phenoId, selectedCohort, selectedStudy }) => {
    const [leadSNPs, setLeadSNPs] = useState([]);
    const [layout, setLayout] = useState({});
    const baseURL = process.env.FRONTEND_BASE_URL || 'http://localhost:5001/api';

    const GAP = 0.008;
    const CHR_COUNT = CHROMOSOME_LENGTHS.length;
    const GAP_COUNT = CHR_COUNT - 1;

    const totalLength = CHROMOSOME_LENGTHS.reduce((a, b) => a + b, 0);
    const totalScale = 1 + GAP_COUNT * GAP;
    const scaleFactor = 1 / totalScale;

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

    const calculateChromosomePositions = () => {
        return chrPositions.map(pos => pos.start + pos.lengthFrac / 2);
    };

    useEffect(() => {
        const fetchLeadSNPs = async () => {
            try {
                // const response = await fetch(`${baseURL}/getLeadVariants`);
                const response = await fetch(`/api/getLeadVariants`);

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

    const transformYValue = (value) => {
        // 0-20: normal scale
        if (value <= 20) return value;
        
        // 20-30: First level compression
        if (value <= 30) {
            return 20 + ((value - 20) * 0.2);
        }
        
        // 30-50: Second level compression
        if (value <= 50) {
            return 22 + ((value - 30) * 0.1);
        }
        
        // Above 50: Maximum compression
        return 24 + ((value - 50) * 0.02);
    };

    const generateYAxisConfig = (maxValue) => {
        const ticks = [];
        const tickPositions = [];

        // Determine the appropriate increment based on maxValue
        let increment;
        if (maxValue <= 10) {
            increment = 1;  // Use increment of 1 for max values up to 10
        } else if (maxValue <= 20) {
            increment = 2;  // Use increment of 2 for max values up to 20
        } else if (maxValue <= 30) {
            // Below 20: increment by 5, above 20: show 30
            for (let i = 0; i <= 20; i += 5) {
                ticks.push(i);
                tickPositions.push(transformYValue(i));
            }
            if (maxValue >= 30) {
                ticks.push(30);
                tickPositions.push(transformYValue(30));
            }
            return { ticks, tickPositions };
        } else if (maxValue <= 50) {
            // Below 20: increment by 5, 20-50: increment by 10
            for (let i = 0; i <= 20; i += 5) {
                ticks.push(i);
                tickPositions.push(transformYValue(i));
            }
            for (let i = 30; i <= maxValue; i += 10) {
                ticks.push(i);
                tickPositions.push(transformYValue(i));
            }
            return { ticks, tickPositions };
        } else {
            // Below 20: increment by 5, 20-50: increment by 10, above 50: increment by 50
            for (let i = 0; i <= 20; i += 5) {
                ticks.push(i);
                tickPositions.push(transformYValue(i));
            }
            for (let i = 30; i <= 50; i += 10) {
                ticks.push(i);
                tickPositions.push(transformYValue(i));
            }
            for (let i = 100; i <= maxValue; i += 50) {
                ticks.push(i);
                tickPositions.push(transformYValue(i));
            }
            return { ticks, tickPositions };
        }

        // Generate ticks for values <= 20
        for (let i = 0; i <= Math.min(maxValue, 20); i += increment) {
            ticks.push(i);
            tickPositions.push(transformYValue(i));
        }

        return { ticks, tickPositions };
    };

    useEffect(() => {
        const allYValues = [...stat, ...dyn].flatMap(d => d.y);
        const maxYValue = Math.ceil(Math.max(...allYValues, threshold || 0));
        const maxLeadSNPLog10p = leadSNPs.reduce((max, snp) => 
            Math.max(max, snp.lead_snp?.log10p || 0), 0
        );
        const absoluteMaxY = Math.max(maxYValue, maxLeadSNPLog10p);
    
        const { ticks, tickPositions } = generateYAxisConfig(absoluteMaxY);
        const transformedThreshold = threshold ? transformYValue(threshold) : null;
    
        const xAxisTicks = calculateChromosomePositions();
        const xAxisLabels = Array.from({length: CHR_COUNT}, (_, i) => (i + 1).toString());    
        
        const getImagePath = async () => {
            if (absoluteMaxY <= 10) {
                return '/images/single_plot11.png';
            }
            try {
                const study = selectedStudy === 'mrmega' ? 'mrmega' : 'gwama';
                const plotType = 'manhattan';
                console.log('manhattan logs')
                console.log(phenoId, selectedCohort, study, plotType)
                // const response = await fetch(
                //     `${baseURL}/getManhattanPlot?phenoId=${phenoId}&cohortId=${selectedCohort}&study=${study}&plotType=${plotType}`
                // );
                const response = await fetch(
                    `/api/getManhattanPlot?phenoId=${phenoId}&cohortId=${selectedCohort}&study=${study}&plotType=${plotType}`
                );
                console.log(response)
                if (!response.ok) {
                    throw new Error('Failed to fetch Manhattan plot');
                }
                
                const blob = await response.blob();
                return URL.createObjectURL(blob);
            } catch (error) {
                console.error('Error fetching Manhattan plot:', error);
                return null;
            }
        };
    
        const shapes = threshold ? [{
            type: 'line',
            xref: 'paper',
            yref: 'y',
            x0: 0,
            x1: 1,
            y0: transformedThreshold,
            y1: transformedThreshold,
            line: {
                color: 'rgb(255, 0, 0)',
                width: 2,
                dash: 'dash'
            }
        }] : [];
    
        (async () => {
            const imageUrl = await getImagePath();
            
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
                    tickvals: tickPositions,
                    ticktext: ticks.map(String),
                    range: [0, transformYValue(absoluteMaxY) + 1],
                    fixedrange: true
                },
                margin: { l: 60, r: 40, t: 20, b: 40 },
                shapes,
                images: [{
                    source: imageUrl,
                    xref: 'x',
                    yref: 'y',
                    x: -0.059,
                    y: absoluteMaxY <= 10 ? 9.6 : 15.2,
                    sizex: 1.23,
                    sizey: absoluteMaxY <= 10 ? 11 : 17.5,
                    xanchor: 'left',
                    yanchor: 'top',
                    sizing: 'stretch',
                    opacity: 1,
                    layer: 'below'
                }]
            });
        })();
    
        return () => {
            const currentLayout = layout?.images?.[0]?.source;
            if (currentLayout && currentLayout.startsWith('blob:')) {
                URL.revokeObjectURL(currentLayout);
            }
        };
    }, [stat, dyn, threshold, leadSNPs, phenoId, selectedCohort, selectedStudy]);
    
    const prepareRegularData = () => {
        const regularTraces = [];
        
        for (let chrIndex = 0; chrIndex < CHR_COUNT; chrIndex++) {
            const chrData = [...stat, ...dyn].filter(d => d.chr === (chrIndex + 1));
            
            chrData.forEach(d => {
                regularTraces.push({
                    x: d.pos.map(p => normalizePosition(chrIndex, p)),
                    y: d.y.map(y => transformYValue(y)),
                    type: 'scattergl',
                    mode: 'markers',
                    marker: { 
                        color: ALTERNATING_COLORS[chrIndex % 2],
                        size: 4,
                        opacity: 1
                    },
                    hoverinfo: 'text',
                    text: d.x.map((xVal, i) => {
                        const snpID = d.SNP_ID && d.SNP_ID[i] ? d.SNP_ID[i] : 'N/A';
                        const posVal = d.pos && d.pos[i] ? d.pos[i] : 'N/A';
                        const originalY = d.y[i];
                        return (
                            `SNP_ID: ${snpID}<br>` +
                            `Chromosome: ${chrIndex + 1}<br>` +
                            `Position: ${posVal.toLocaleString()}<br>` +
                            `-log10 p-value: ${originalY.toFixed(2)}<br>` +
                            `P-value: ${Math.pow(10, -originalY).toExponential(2)}`
                        );
                    }),
                    showlegend: false
                });
            });
        }
    
        return regularTraces;
    };

    const prepareLeadSNPData = () => {
        if (!leadSNPs.length) return null;
    
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
            showlegend: false,
            name: `Lead SNPs (${selectedCohort})`
        };
    
        leadSNPs.forEach(snp => {
            const chr = parseInt(snp.lead_snp.position.chromosome, 10) - 1;
            const pos = parseInt(snp.lead_snp.position.position, 10);
            const log10p = parseFloat(snp.lead_snp.log10p);
            
            const normalizedPos = normalizePosition(chr, pos);
            const transformedY = transformYValue(log10p);
            
            leadSNPTrace.x.push(normalizedPos);
            leadSNPTrace.y.push(transformedY);
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