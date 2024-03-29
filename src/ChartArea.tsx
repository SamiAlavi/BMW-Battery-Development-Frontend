import Plot from 'react-plotly.js';

export default function ChartArea() {
  
    return (
        <div className="w-screen h-screen pt-7">
            <div className="w-full h-full">
            <Plot
                data={[
                {
                    x: [1, 2, 3],
                    y: [2, 6, 3],
                    type: 'scatter',
                    mode: 'lines+markers',
                    marker: {color: 'red'},
                },
                ]}
                layout={{width: 1000, height: 500, title: 'A Fancy Plot'}}
            />
            </div>
        </div>
    );
}
