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
        let axis: any = {}
        let valuesLength = 0
        Object.entries(data).forEach(([col, values]) => {
            const label = (colsAxisMapping[col] ?? "").toLowerCase()
            axis[label] = values
            valuesLength = values.length
        })
        const graphAxis = Object.keys(axis)
        if (graphAxis.length === 1) {
            const indexLabel = ["x", "y", "z"].filter((val) => !graphAxis.includes(val))[0]
            const indexes = generateArray(valuesLength)
            axis[indexLabel] = indexes
        }
        
        console.log(axis)
        
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