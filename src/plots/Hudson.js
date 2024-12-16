// import React from 'react';
// import Plot from 'react-plotly.js';
// import { Card } from '../ui/cards';

// const ALTERNATING_COLORS = [
//   '#DC2626', // Dark Red
//   '#2563EB'  // Blue
// ];

// const BORDER_LINE = -Math.log10(5e-8); // Genome-wide significance threshold

// const generateYAxisTicks = (maxValue) => {
//     const ticks = [];
//     let currentValue = 0;
//     while (currentValue <= maxValue) {
//       if (currentValue <= 20) {
//         ticks.push(currentValue);
//         currentValue += 1;
//       } else if (currentValue <= 50) {
//         if (currentValue === 20) {
//           currentValue = Math.ceil(currentValue / 10) * 10;
//         }
//         ticks.push(currentValue);
//         currentValue += 10;
//       } else {
//         if (currentValue === 50) {
//           currentValue = Math.ceil(currentValue / 50) * 50;
//         }
//         ticks.push(currentValue);
//         currentValue += 50;
//       }
//     }
//     return ticks;
//   };
  
// // Chromosome lengths
// const CHROMOSOME_LENGTHS = [
//   248956422, 242193529, 198295559, 190214555, 181538259, 170805979,
//   159345973, 145138636, 138394717, 133797422, 135086622, 133275309,
//   114364328, 107043718, 101991189, 90338345, 83257441, 80373285,
//   58617616, 64444167, 46709983, 50818468
// ];

// const CHR_COUNT = CHROMOSOME_LENGTHS.length;  // 22
// const GAP = 0.008; // Spacing factor between chromosomes
// const GAP_COUNT = CHR_COUNT - 1;

// // Compute total scale with gaps
// const totalLength = CHROMOSOME_LENGTHS.reduce((a, b) => a + b, 0);
// const totalScale = 1 + GAP_COUNT * GAP;
// const scaleFactor = 1 / totalScale;

// const chrPositions = [];
// {
//   let currentPos = 0;
//   for (let i = 0; i < CHR_COUNT; i++) {
//     const chrFrac = (CHROMOSOME_LENGTHS[i] / totalLength) * scaleFactor;
//     chrPositions.push({
//       start: currentPos,
//       end: currentPos + chrFrac,
//       lengthFrac: chrFrac
//     });
//     currentPos += chrFrac;
//     if (i < CHR_COUNT - 1) {
//       currentPos += GAP * scaleFactor;
//     }
//   }
// }

// function normalizePosition(chrIndex, pos) {
//   const { start, lengthFrac } = chrPositions[chrIndex];
//   const fractionWithinChr = pos / CHROMOSOME_LENGTHS[chrIndex];
//   return start + fractionWithinChr * lengthFrac;
// }

// function generateFillPoints(chrIndex, existingPoints, topPlot) {
//   // Similar logic from Manhattan to fill with dummy points
//   const fillPoints = [];
//   const FILL_DENSITY = 25000;

//   // Configuration
//   const BASE_REGION_MAX = 4;   // Dense region cutoff
//   const MAX_Y = 5.2;           // Maximum y-value to fill for dummy points
//   const BASE_DENSITY = 0.98;   // Very high density for the main region

//   const { start, end } = chrPositions[chrIndex];
//   const spacing = (end - start) / FILL_DENSITY;

//   // Determine orientation for y:
//   // Top plot: normal orientation (0 to 10), we fill 0 to ~5.2
//   // Bottom plot: inverted (0 to 10 reversed), but we still generate from low to high y-values.
//   // We'll generate in the same way, because the plot is inverted by layout, not by the data.

//   for (let i = 0; i < FILL_DENSITY; i++) {
//     const x = start + (end - start) * (i / FILL_DENSITY);
//     const hasRealPoint = existingPoints.some(p => Math.abs(p.x - x) < spacing);

//     if (!hasRealPoint) {
//       const baseY = Math.random() * MAX_Y;
//       // For top plot, we place dummy points from 0 upwards.
//       // For bottom plot, since axis is reversed, placing them at baseY still works (the axis inverts them).
//       if (baseY <= BASE_REGION_MAX) {
//         // Dense region 0-4
//         if (Math.random() < BASE_DENSITY) {
//           fillPoints.push({ x, y: baseY });
//         }
//       } else {
//         // Sparse region above 4
//         const heightFraction = (baseY - BASE_REGION_MAX) / (MAX_Y - BASE_REGION_MAX);
//         const addProb = Math.pow(1 - heightFraction, 1.5) * 0.3;
//         if (Math.random() < addProb) {
//           fillPoints.push({ x, y: baseY });
//         }
//       }
//     }
//   }

//   // Add a few more scattered points in the upper region
//   const SCATTER_COUNT = FILL_DENSITY * 0.01;
//   for (let i = 0; i < SCATTER_COUNT; i++) {
//     const x = start + (end - start) * Math.random();
//     const y = BASE_REGION_MAX + Math.random() * (MAX_Y - BASE_REGION_MAX);
//     const heightFraction = (y - BASE_REGION_MAX) / (MAX_Y - BASE_REGION_MAX);
//     if (Math.random() < (1 - heightFraction) * 0.3) {
//       fillPoints.push({ x, y });
//     }
//   }

//   return fillPoints;
// }

// function prepareTraces(dyn, stat, topPlot) {
//   // Combine dyn and stat data (already normalized)
//   const combined = [...dyn, ...stat];

//   const traces = [];
//   for (let chrIndex = 0; chrIndex < CHR_COUNT; chrIndex++) {
//     const chrNumber = chrIndex + 1;
//     const chrData = combined.filter(d => d.chr === chrNumber);

//     // Extract existing points for this chromosome
//     const existingPoints = chrData.flatMap(d =>
//       d.x.map((pos, i) => ({ x: normalizePosition(chrIndex, d.pos[i]), y: d.y[i] }))
//     );

//     // Generate fill points
//     const fillPoints = generateFillPoints(chrIndex, existingPoints, topPlot);

//     // Alternate color by chromosome
//     const color = ALTERNATING_COLORS[chrIndex % ALTERNATING_COLORS.length];

//     // Add fill points trace
//     traces.push({
//       x: fillPoints.map(p => p.x),
//       y: fillPoints.map(p => p.y),
//       type: 'scattergl',
//       mode: 'markers',
//       marker: {
//         color: color,
//         size: 4,
//         opacity: 1
//       },
//       hoverinfo: 'skip',
//       showlegend: false,
//       xaxis: topPlot ? 'x' : 'x2',
//       yaxis: topPlot ? 'y' : 'y2'
//     });

//     // Add real data points
//     chrData.forEach(d => {
//       traces.push({
//         x: d.pos.map(p => normalizePosition(chrIndex, p)),
//         y: d.y,
//         type: 'scattergl',
//         mode: 'markers',
//         marker: {
//           color: color,
//           size: 4,
//           opacity: 0.8
//         },
//         hoverinfo: 'text',
//         text: d.x.map((xVal, i) => {
//           const snpID = d.SNP_ID && d.SNP_ID[i] ? d.SNP_ID[i] : 'N/A';
//           const posVal = d.pos && d.pos[i] ? d.pos[i] : 'N/A';
//           return `SNP_ID: ${snpID}<br>Chromosome: ${chrIndex}<br>Position: ${posVal.toLocaleString()}<br>-log10 p-value: ${d.y[i].toFixed(2)}<br>P-value: ${Math.pow(10, -d.y[i]).toExponential(2)}`;
//         }),
//         showlegend: false,
//         xaxis: topPlot ? 'x' : 'x2',
//         yaxis: topPlot ? 'y' : 'y2'
//       });
//     });
//   }

//   return traces;
// }

// const HUDSON_LAYOUT = {
//   width: 1000,
//   height: 750,
//   showlegend: false,

//   xaxis: {
//     domain: [0, 1],
//     anchor: 'y',
//     title: 'Chromosome',
//     showline: false,
//     zeroline: false,
//     mirror: false,
//   },
//   yaxis: {
//     domain: [0.5, 1], // top half
//     anchor: 'x',
//     title: '-log10 p-value',
//     range: [0, 10],
//     tickmode: 'linear',
//     tick0: 0,
//     dtick: 1,
//     showline: true,
//     zeroline: false,
//   },

//   xaxis2: {
//     domain: [0, 1],
//     anchor: 'y2',
//     title: 'Chromosome',
//     showline: false,
//     zeroline: false,
//     mirror: false,
//   },
//   yaxis2: {
//     domain: [0, 0.45], // bottom half
//     anchor: 'x2',
//     title: '-log10 p-value',
//     range: [10, 0], // reversed
//     tickmode: 'linear',
//     tick0: 0,
//     dtick: 1,
//     showline: true,
//     zeroline: false,
//   },
//   shapes: [
//     {
//       type: 'line',
//       xref: 'paper',
//       x0: 0,
//       x1: 1,
//       y0: BORDER_LINE,
//       y1: BORDER_LINE,
//       line: { color: 'red', width: 1, dash: 'dash' },
//       yref: 'y'
//     },
//     {
//       type: 'line',
//       xref: 'paper',
//       x0: 0,
//       x1: 1,
//       y0: BORDER_LINE,
//       y1: BORDER_LINE,
//       line: { color: 'red', width: 1, dash: 'dash' },
//       yref: 'y2'
//     }
//   ],
// };

// const CohortSelector = ({ 
//   availableCohorts, 
//   selectedCohort, 
//   onCohortChange, 
//   position 
// }) => (
//   <div className="flex flex-col space-y-2 p-4 bg-white rounded-lg shadow">
//     <span className="text-sm font-medium text-gray-700">
//       Select {position} Cohort:
//     </span>
//     <div className="flex flex-wrap gap-2">
//       {availableCohorts.map((cohort) => (
//         <button
//           key={cohort}
//           onClick={() => onCohortChange(cohort)}
//           className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
//             selectedCohort === cohort
//               ? 'bg-blue-600 text-white'
//               : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//           }`}
//         >
//           {cohort}
//         </button>
//       ))}
//     </div>
//   </div>
// );

// export const Hudson = ({
//   dynTop, statTop, dynBott, statBott,
//   ticksTop, ticksBott,
//   selectedTopAncestry,
//   selectedBottomAncestry,
//   onTopAncestryChange,
//   onBottomAncestryChange,
//   loadingTop,
//   loadingBottom,
//   availableCohorts
// }) => {
//   // Prepare data for top plot (normalize and fill)
//   const topData = prepareTraces(dynTop, statTop, true);
//   const bottomData = prepareTraces(dynBott, statBott, false);

//   const getMaxY = (data) => {
//     return Math.ceil(Math.max(...data.flatMap(trace => 
//       Array.isArray(trace.y) ? trace.y : []
//     )));
//   };
//   const topMaxY = getMaxY([...dynTop, ...statTop]);
//   const bottomMaxY = getMaxY([...dynBott, ...statBott]);

//   const topTicks = generateYAxisTicks(topMaxY);
//   const bottomTicks = generateYAxisTicks(bottomMaxY);

//     const getMaxRange = (ticks) => {
//     const lastTick = ticks[ticks.length - 1];
//     return lastTick + (
//       lastTick > 50 ? 50 : 
//       lastTick > 20 ? 10 : 1
//     );
//   };

//   const topMaxRange = getMaxRange(topTicks);
//   const bottomMaxRange = getMaxRange(bottomTicks);

//   // Generate chromosome tick values and labels
//   const tickvals = chrPositions.map(pos => pos.start + pos.lengthFrac / 2);
//   const ticktext = Array.from({ length: CHR_COUNT }, (_, i) => i.toString());

//   const layout = {
//     ...HUDSON_LAYOUT,
//     xaxis: { 
//       ...HUDSON_LAYOUT.xaxis,
//       tickvals: tickvals,
//       ticktext: ticktext,
//     },
//     xaxis2: { 
//       ...HUDSON_LAYOUT.xaxis2,
//       tickvals: tickvals,
//       ticktext: ticktext,
//     },
//     yaxis: {
//       ...HUDSON_LAYOUT.yaxis,
//       range: [0, topMaxRange],
//       tickmode: 'array',
//       tickvals: topTicks,
//       ticktext: topTicks.map(String),
//     },
//     yaxis2: {
//       ...HUDSON_LAYOUT.yaxis2,
//       range: [bottomMaxRange, 0], // Note: reversed for bottom plot
//       tickmode: 'array',
//       tickvals: bottomTicks,
//       ticktext: bottomTicks.map(String),
//     },
//   };

//   const data = [...topData, ...bottomData];

//   return (
//     <div className="space-y-4">
//       <div className="grid grid-cols-2 gap-4">
//         <CohortSelector
//           availableCohorts={availableCohorts}
//           selectedCohort={selectedTopAncestry}
//           onCohortChange={onTopAncestryChange}
//           position="Top"
//         />
//         <CohortSelector
//           availableCohorts={availableCohorts}
//           selectedCohort={selectedBottomAncestry}
//           onCohortChange={onBottomAncestryChange}
//           position="Bottom"
//         />
//       </div>

//       <Card>
//         <div className="relative p-4">
//           <Plot
//             data={data}
//             layout={layout}
//             config={{ 
//               responsive: true,
//               displayModeBar: false
//             }}
//           />
//           {(loadingTop || loadingBottom) && (
//             <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
//               <div className="flex items-center space-x-2">
//                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
//                 <span className="text-sm text-gray-600">Loading plots...</span>
//               </div>
//             </div>
//           )}
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default Hudson;

import React from 'react';
import Plot from 'react-plotly.js';
import { Card } from '../ui/cards';

// Y-Axis Transformation Functions
const transformYValue = (value) => {
  if (value <= 20) return value;
  if (value <= 50) return 20 + (value - 20) / 10;
  return 23 + (value - 50) / 50;
};

const inverseTransformYValue = (displayValue) => {
  if (displayValue <= 20) return displayValue;
  if (displayValue <= 23) return 20 + (displayValue - 20) * 10;
  return 50 + (displayValue - 23) * 50;
};

// Modified Generate Y-Axis Ticks Function
const generateYAxisTicks = (maxValue) => {
  const ticks = [];
  const tickPositions = [];
  let currentValue = 0;

  // Up to 20 (increment by 1)
  while (currentValue <= Math.min(20, maxValue)) {
    ticks.push(currentValue);
    tickPositions.push(transformYValue(currentValue));
    currentValue += 1;
  }

  // From 30 to 50 (increment by 10)
  if (maxValue > 20) {
    currentValue = 30;
    while (currentValue <= Math.min(50, maxValue)) {
      ticks.push(currentValue);
      tickPositions.push(transformYValue(currentValue));
      currentValue += 10;
    }
  }

  // Above 50 (increment by 50)
  if (maxValue > 50) {
    currentValue = 100;
    while (currentValue <= maxValue) {
      ticks.push(currentValue);
      tickPositions.push(transformYValue(currentValue));
      currentValue += 50;
    }
  }

  return { ticks, tickPositions };
};

// Chromosome Colors
const ALTERNATING_COLORS = [
  '#DC2626', // Dark Red
  '#2563EB'  // Blue
];

const BORDER_LINE = -Math.log10(5e-8); // Genome-wide significance threshold

// Chromosome Lengths
const CHROMOSOME_LENGTHS = [
  248956422, 242193529, 198295559, 190214555, 181538259, 170805979,
  159345973, 145138636, 138394717, 133797422, 135086622, 133275309,
  114364328, 107043718, 101991189, 90338345, 83257441, 80373285,
  58617616, 64444167, 46709983, 50818468
];

const CHR_COUNT = CHROMOSOME_LENGTHS.length;  // 22
const GAP = 0.008; // Spacing factor between chromosomes
const GAP_COUNT = CHR_COUNT - 1;

// Compute Total Scale with Gaps
const totalLength = CHROMOSOME_LENGTHS.reduce((a, b) => a + b, 0);
const totalScale = 1 + GAP_COUNT * GAP;
const scaleFactor = 1 / totalScale;

// Calculate Chromosome Positions
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

// Normalize Position Function
function normalizePosition(chrIndex, pos) {
  const { start, lengthFrac } = chrPositions[chrIndex];
  const fractionWithinChr = pos / CHROMOSOME_LENGTHS[chrIndex];
  return start + fractionWithinChr * lengthFrac;
}

// Generate Fill Points Function
function generateFillPoints(chrIndex, existingPoints, topPlot) {
  const fillPoints = [];
  const FILL_DENSITY = 25000;

  // Configuration
  const BASE_REGION_MAX = 4;   // Dense region cutoff
  const MAX_Y = 5.2;           // Maximum y-value to fill for dummy points
  const BASE_DENSITY = 0.98;   // Very high density for the main region

  const { start, end } = chrPositions[chrIndex];
  const spacing = (end - start) / FILL_DENSITY;

  for (let i = 0; i < FILL_DENSITY; i++) {
    const x = start + (end - start) * (i / FILL_DENSITY);
    const hasRealPoint = existingPoints.some(p => Math.abs(p.x - x) < spacing);

    if (!hasRealPoint) {
      const baseY = Math.random() * MAX_Y;
      if (baseY <= BASE_REGION_MAX) {
        if (Math.random() < BASE_DENSITY) {
          fillPoints.push({ x, y: baseY });
        }
      } else {
        const heightFraction = (baseY - BASE_REGION_MAX) / (MAX_Y - BASE_REGION_MAX);
        const addProb = Math.pow(1 - heightFraction, 1.5) * 0.3;
        if (Math.random() < addProb) {
          fillPoints.push({ x, y: baseY });
        }
      }
    }
  }

  // Add Scattered Points in Upper Region
  const SCATTER_COUNT = FILL_DENSITY * 0.01;
  for (let i = 0; i < SCATTER_COUNT; i++) {
    const x = start + (end - start) * Math.random();
    const y = BASE_REGION_MAX + Math.random() * (MAX_Y - BASE_REGION_MAX);
    const heightFraction = (y - BASE_REGION_MAX) / (MAX_Y - BASE_REGION_MAX);
    if (Math.random() < (1 - heightFraction) * 0.3) {
      fillPoints.push({ x, y });
    }
  }

  return fillPoints;
}

// Modified Prepare Traces Function
function prepareTraces(dyn, stat, topPlot) {
  const combined = [...dyn, ...stat];
  const traces = [];

  for (let chrIndex = 0; chrIndex < CHR_COUNT; chrIndex++) {
    const chrNumber = chrIndex + 1;
    const chrData = combined.filter(d => d.chr === chrNumber);

    // Transform Existing Points
    const existingPoints = chrData.flatMap(d =>
      d.x.map((pos, i) => ({ 
        x: normalizePosition(chrIndex, d.pos[i]), 
        y: transformYValue(d.y[i])
      }))
    );

    // Generate Fill Points
    const fillPoints = generateFillPoints(chrIndex, existingPoints, topPlot);
    const color = ALTERNATING_COLORS[chrIndex % ALTERNATING_COLORS.length];

    // Add Fill Points Trace with Transformed Y-Values
    traces.push({
      x: fillPoints.map(p => p.x),
      y: fillPoints.map(p => transformYValue(p.y)),
      type: 'scattergl',
      mode: 'markers',
      marker: {
        color: color,
        size: 4,
        opacity: 1
      },
      hoverinfo: 'skip',
      showlegend: false,
      xaxis: topPlot ? 'x' : 'x2',
      yaxis: topPlot ? 'y' : 'y2'
    });

    // Add Real Data Points with Transformed Y-Values
    chrData.forEach(d => {
      traces.push({
        x: d.pos.map(p => normalizePosition(chrIndex, p)),
        y: d.y.map(y => transformYValue(y)),
        type: 'scattergl',
        mode: 'markers',
        marker: {
          color: color,
          size: 4,
          opacity: 0.8
        },
        hoverinfo: 'text',
        text: d.x.map((xVal, i) => {
          const snpID = d.SNP_ID && d.SNP_ID[i] ? d.SNP_ID[i] : 'N/A';
          const posVal = d.pos && d.pos[i] ? d.pos[i] : 'N/A';
          const originalY = d.y[i];
          return `SNP_ID: ${snpID}<br>` +
                 `Chromosome: ${chrNumber}<br>` +
                 `Position: ${posVal.toLocaleString()}<br>` +
                 `-log10 p-value: ${originalY.toFixed(2)}<br>` +
                 `P-value: ${Math.pow(10, -originalY).toExponential(2)}`;
        }),
        showlegend: false,
        xaxis: topPlot ? 'x' : 'x2',
        yaxis: topPlot ? 'y' : 'y2'
      });
    });
  }

  return traces;
}

// Layout Configuration
const HUDSON_LAYOUT = {
  width: 1000,
  height: 750,
  showlegend: false,

  xaxis: {
    domain: [0, 1],
    anchor: 'y',
    title: 'Chromosome',
    showline: false,
    zeroline: false,
    mirror: false,
  },
  yaxis: {
    domain: [0.55, 1], // Adjusted to accommodate transformed ticks
    anchor: 'x',
    title: '-log10 p-value',
    range: [0, 24], // Updated range based on transformYValue
    tickmode: 'array',
    tickvals: [], // To be populated dynamically
    ticktext: [], // To be populated dynamically
    showline: true,
    zeroline: false,
  },

  xaxis2: {
    domain: [0, 1],
    anchor: 'y2',
    title: 'Chromosome',
    showline: false,
    zeroline: false,
    mirror: false,
  },
  yaxis2: {
    domain: [0, 0.45], // bottom half
    anchor: 'x2',
    title: '-log10 p-value',
    range: [24, 0], // Reversed and updated based on transformYValue
    tickmode: 'array',
    tickvals: [], // To be populated dynamically
    ticktext: [], // To be populated dynamically
    showline: true,
    zeroline: false,
  },
  shapes: [
    {
      type: 'line',
      xref: 'paper',
      x0: 0,
      x1: 1,
      y0: BORDER_LINE,
      y1: BORDER_LINE,
      line: { color: 'red', width: 1, dash: 'dash' },
      yref: 'y'
    },
    {
      type: 'line',
      xref: 'paper',
      x0: 0,
      x1: 1,
      y0: BORDER_LINE,
      y1: BORDER_LINE,
      line: { color: 'red', width: 1, dash: 'dash' },
      yref: 'y2'
    }
  ],
};

// Cohort Selector Component
const CohortSelector = ({ 
  availableCohorts, 
  selectedCohort, 
  onCohortChange, 
  position 
}) => (
  <div className="flex flex-col space-y-2 p-4 bg-white rounded-lg shadow">
    <span className="text-sm font-medium text-gray-700">
      Select {position} Cohort:
    </span>
    <div className="flex flex-wrap gap-2">
      {availableCohorts.map((cohort) => (
        <button
          key={cohort}
          onClick={() => onCohortChange(cohort)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedCohort === cohort
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {cohort}
        </button>
      ))}
    </div>
  </div>
);

// Updated Hudson Component
export const Hudson = ({
  dynTop, statTop, dynBott, statBott,
  ticksTop, ticksBott,
  selectedTopAncestry,
  selectedBottomAncestry,
  onTopAncestryChange,
  onBottomAncestryChange,
  loadingTop,
  loadingBottom,
  availableCohorts
}) => {
  // Prepare Data for Top and Bottom Plots
  const topData = prepareTraces(dynTop, statTop, true);
  const bottomData = prepareTraces(dynBott, statBott, false);

  // Function to Get Maximum Y-Value
  const getMaxY = (data) => {
    return Math.ceil(Math.max(...data.flatMap(trace => 
      Array.isArray(trace.y) ? trace.y : []
    )));
  };

  const topMaxY = getMaxY([...dynTop, ...statTop]);
  const bottomMaxY = getMaxY([...dynBott, ...statBott]);

  // Generate Y-Axis Ticks and Positions
  const { ticks: topTicks, tickPositions: topTickPositions } = generateYAxisTicks(topMaxY);
  const { ticks: bottomTicks, tickPositions: bottomTickPositions } = generateYAxisTicks(bottomMaxY);

  // Calculate Maximum Range Based on Transformed Values
  const getMaxRange = (maxY) => {
    return transformYValue(maxY) + 1;
  };

  const topMaxRange = getMaxRange(topMaxY);
  const bottomMaxRange = getMaxRange(bottomMaxY);

  // Generate Chromosome Tick Values and Labels
  const tickvals = chrPositions.map(pos => pos.start + pos.lengthFrac / 2);
  const ticktext = Array.from({ length: CHR_COUNT }, (_, i) => (i + 1).toString());

  // Update Layout with Transformed Y-Axis
  const layout = {
    ...HUDSON_LAYOUT,
    xaxis: { 
      ...HUDSON_LAYOUT.xaxis,
      tickvals: tickvals,
      ticktext: ticktext,
    },
    xaxis2: { 
      ...HUDSON_LAYOUT.xaxis2,
      tickvals: tickvals,
      ticktext: ticktext,
    },
    yaxis: {
      ...HUDSON_LAYOUT.yaxis,
      range: [0, topMaxRange],
      tickmode: 'array',
      tickvals: topTickPositions,
      ticktext: topTicks.map(String),
    },
    yaxis2: {
      ...HUDSON_LAYOUT.yaxis2,
      range: [bottomMaxRange, 0], // Reversed for bottom plot
      tickmode: 'array',
      tickvals: bottomTickPositions,
      ticktext: bottomTicks.map(String),
    },
  };

  const data = [...topData, ...bottomData];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <CohortSelector
          availableCohorts={availableCohorts}
          selectedCohort={selectedTopAncestry}
          onCohortChange={onTopAncestryChange}
          position="Top"
        />
        <CohortSelector
          availableCohorts={availableCohorts}
          selectedCohort={selectedBottomAncestry}
          onCohortChange={onBottomAncestryChange}
          position="Bottom"
        />
      </div>

      <Card>
        <div className="relative p-4">
          <Plot
            data={data}
            layout={layout}
            config={{ 
              responsive: true,
              displayModeBar: false
            }}
          />
          {(loadingTop || loadingBottom) && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                <span className="text-sm text-gray-600">Loading plots...</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Hudson;
