import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { IVisualizationData } from './interfaces';
import { Config, Layout, PlotData } from 'plotly.js';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

interface Props {
    visualizationData: IVisualizationData;
}

function generateArray(n: number) {
    return Array.from({ length: n }, (_, index) => index);
}

const ChartArea: React.FC<Props> = ({ visualizationData }) => {
    const _plotModes: string[] = ["lines", "markers", "lines+markers"]
    const _plotTypes3d: string[]  = ["scatter3d"]

    const [data, setData] = useState<Partial<PlotData>>({});
    const [selectedPlotMode, setselectedPlotMode] = useState<string>(_plotModes[0]);
    const [selectedPlotType, setselectedPlotType] = useState<string>(_plotTypes3d[0]);
    const [layout, setLayout] = useState<Partial<Layout>>({width: 1000, height: 500});
    const [is3d, setIs3d] = useState<boolean>(false);
    const [config, setConfig] = useState<Partial<Config>>({
        scrollZoom: true,
        editable: true,
        showLink: true,
        plotlyServerURL: "https://chart-studio.plotly.com",
        responsive: true,
    });
    
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

        const _data: Partial<PlotData> = {
            ...axis,
            type: graphAxis.length === 3 ? selectedPlotType : "scattergl",
            mode: selectedPlotMode,
            marker: {color: 'red'},
        }

        setIs3d(graphAxis.length === 3)
        setLayout(_layout)
        setData(_data)
    }, [visualizationData]);

    const onModeChange = (e: DropdownChangeEvent) => {
        setselectedPlotMode(e.value)
        setData({
            ...data,
            mode: e.value,
        })
    }

    const onTypeChange = (e: DropdownChangeEvent) => {
        setselectedPlotType(e.value)
        setData({
            ...data,
            type: is3d ? e.value : "scattergl",
        })
    }
  
    return (
        <div className="w-screen h-screen pt-7">
            <div className="w-full h-full">
                <div>
                    <Dropdown value={selectedPlotMode} onChange={onModeChange} options={_plotModes} 
                        placeholder="Select Plot Mode" className="w-5 m-3" />
                </div>
                {
                    is3d ? (
                        
                    <div>
                        <Dropdown value={selectedPlotType} onChange={onTypeChange} options={_plotTypes3d} 
                            placeholder="Select Plot Types" className="w-5 m-3" />
                    </div>
                    ) : <></>
                }

                <Plot
                    data={[data]}
                    layout={layout}
                    config={config}
                />
            </div>
        </div>
    );
}

export default ChartArea;