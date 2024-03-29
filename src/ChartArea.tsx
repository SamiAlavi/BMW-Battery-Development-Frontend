import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { IVisualizationData } from './interfaces';

interface Props {
    visualizationData: IVisualizationData;
}

const ChartArea: React.FC<Props> = ({ visualizationData }) => {
    const [xData, setXData] = useState<string[]|number[]>([]);
    const [yData, setYData] = useState<string[]|number[]>([]);
    const [zData, setZData] = useState<string[]|number[]>([]);
    const [title, setTitle] = useState<string>("");

    let temp = {}
    useEffect(() => {
        console.log(visualizationData)
        temp = visualizationData
        setTitle(visualizationData.type)
    }, [visualizationData]);
  
    return (
        <div className="w-screen h-screen pt-7">
            <div className="w-full h-full">
            <Plot
                data={[
                {
                    x: [1, 2, 3],
                    y: [2, 6, 3],
                    z: [2, 6, 3],
                    type: 'scatter',
                    mode: 'lines+markers',
                    marker: {color: 'red'},
                },
                ]}
                layout={{width: 1000, height: 500, title: title}}
            />
            </div>
        </div>
    );
}

export default ChartArea;