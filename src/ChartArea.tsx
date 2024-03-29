import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { IVisualizationData } from './interfaces';
import { Data, Layout } from 'plotly.js';

interface Props {
    visualizationData: IVisualizationData;
}

function generateArray(n: number) {
    return Array.from({ length: n }, (_, index) => index);
}

const ChartArea: React.FC<Props> = ({ visualizationData }) => {
    const [data, setData] = useState<Data[]>([]);
    const [layout, setLayout] = useState<Partial<Layout>>({width: 1000, height: 500});

    useEffect(() => {
        if (Object.keys(visualizationData).length === 0) {
            return
        }
        const {data, type, colsAxisMapping} = visualizationData
        const axis: any = {}
        const _layout: any = {width: 1000, height: 500, title: type}
        let valuesLength = 0

        Object.entries(data).forEach(([col, values]) => {
            const label = (colsAxisMapping[col] ?? "").toLowerCase()
            axis[label] = values
            _layout[`${label}axis`] = {title: col}
            valuesLength = values.length
        })
        
        const graphAxis = Object.keys(axis)
        if (graphAxis.length === 1) {
            const label = ["x", "y", "z"].filter((val) => !graphAxis.includes(val))[0]
            const indexes = generateArray(valuesLength)
            axis[label] = indexes
            _layout[`${label}axis`] = {title: label}
        }

        const _data: Data[] = [
            {
                ...axis,
                type: 'scatter',
                mode: 'lines+markers',
                marker: {color: 'red'},
            },
        ]
        setLayout(_layout)
        setData(_data)
    }, [visualizationData]);
  
    return (
        <div className="w-screen h-screen pt-7">
            <div className="w-full h-full">
            <Plot
                data={data}
                layout={layout}
            />
            </div>
        </div>
    );
}

export default ChartArea;