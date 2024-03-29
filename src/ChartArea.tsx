import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { IVisualizationData } from './interfaces';
import { Config, Data, Layout } from 'plotly.js';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

interface Props {
    visualizationData: IVisualizationData;
}

function generateArray(n: number) {
    return Array.from({ length: n }, (_, index) => index);
}

const ChartArea: React.FC<Props> = ({ visualizationData }) => {
    const [data, setData] = useState<Data[]>([]);
    const [selectedPlotType, setSelectedPlotType] = useState<string | null>(null);
    const [plotTypes, setPlotTypes] = useState<string[]>([]);
    const [layout, setLayout] = useState<Partial<Layout>>({width: 1000, height: 500});
    const [config, setConfig] = useState<Partial<Config>>({
        scrollZoom: true,
        editable: true,
        showLink: true,
        plotlyServerURL: "https://chart-studio.plotly.com",
        responsive: true,
    });

    const plotTypes2d: string[] = []
    const plotTypes3d: string[]  = []
    
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

        setPlotTypes(graphAxis.length === 3 ? plotTypes3d : plotTypes2d)

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

    const onDropdownChange = (e: DropdownChangeEvent) => {
        setSelectedPlotType(e.value)
    }
  
    return (
        <div className="w-screen h-screen pt-7">
            <div className="w-full h-full">
                <div>                    
                    <Dropdown value={selectedPlotType} onChange={onDropdownChange} options={plotTypes} 
                        placeholder="Select Plot Type" className="w-5 m-3" />
                </div>

                <Plot
                    data={data}
                    layout={layout}
                    config={config}
                />
            </div>
        </div>
    );
}

export default ChartArea;