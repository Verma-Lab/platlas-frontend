// import Card from 'react-bootstrap/Card'
// import Image from 'react-bootstrap/Image'

// export const QQ = (props) => {
//   return (
//     <Card style={{alignItems: 'center', width: '100%'}}>
//       <Image src={props.src} fluid/>
//     </Card>
//   )
// }
import React from 'react';
import Card from 'react-bootstrap/Card';
import Plot from 'react-plotly.js';

export const QQ = ({ data }) => {
  return (
    <Card style={{ alignItems: 'center', width: '100%' }}>
      {data ? (
        <Plot
          data={[
            {
              x: data.x,
              y: data.y,
              type: 'scatter',
              mode: 'markers',
              marker: { color: 'blue' },
            },
          ]}
          layout={{
            title: 'QQ Plot',
            xaxis: {
              title: 'Theoretical Quantiles',
              range: [Math.min(...data.x), Math.max(...data.x)], // setting the range explicitly
            },
            yaxis: {
              title: 'Observed Quantiles',
              range: [Math.min(...data.y), Math.max(...data.y)], // setting the range explicitly
            },
            autosize: true,
          }}
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <p>Loading...</p>
      )}
    </Card>
  );
};
