import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { IVisualizationData } from './interfaces';
import { Data } from 'plotly.js';

interface Props {
    visualizationData: IVisualizationData;
}

function generateArray(n: number) {
    return Array.from({ length: n }, (_, index) => index);
}

const ChartArea: React.FC<Props> = ({ visualizationData }) => {
    const [data, setData] = useState<Data[]>([]);
    const [title, setTitle] = useState<string>("");

    useEffect(() => {
        if (Object.keys(visualizationData).length === 0) {
            return
        }
        const {cols, data, type, colsAxisMapping} = visualizationData
        let axis = {}
        if (cols.length === 1) {
            const values = data.map((val) => Object.values(val)).flat();
            if (colsAxisMapping[cols[0]]==="X") {
                axis = {
                    x: values,
                    y: generateArray(values.length)
                }
            }
        }
        const _data: Data[] = [
            {
                ...axis,
                type: 'scatter',
                mode: 'lines+markers',
                marker: {color: 'red'},
            },
        ]
        console.log(visualizationData)
        console.log(_data)
        setTitle(type)
        setData(_data)
    }, [visualizationData]);
  
    return (
        <div className="w-screen h-screen pt-7">
            <div className="w-full h-full">
            <Plot
                data={data}
                layout={{width: 1000, height: 500, title: title}}
            />
            </div>
        </div>
    );
}

export default ChartArea;