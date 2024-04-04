import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { IVisualizationData } from './interfaces';
import { Config, Layout, PlotData } from 'plotly.js';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

interface Props {
    visualizationData: IVisualizationData;
}

type TDownloadFormat = "png" | "svg" | "jpeg" | "webp"

function generateArray(n: number) {
    return Array.from({ length: n }, (_, index) => index);
}

function getPlotWidth() {
    return window.innerWidth
}
function getPlotHeight() {
    return window.innerHeight/1.25
}

const ChartArea: React.FC<Props> = ({ visualizationData }) => {
    const _plotModes: string[] = ["markers", "lines", "lines+markers"]
    const _plotTypes3d: string[]  = ["scatter3d"]
    const _downloadFormats: TDownloadFormat[]  = ["png", "svg", "jpeg", "webp"]

    const [data, setData] = useState<Partial<PlotData>>({});
    const [selectedPlotMode, setselectedPlotMode] = useState<string>(_plotModes[0]);
    const [selectedPlotType, setselectedPlotType] = useState<string>(_plotTypes3d[0]);
    const [selectedDownloadFormat, setselectedDownloadFormat] = useState<TDownloadFormat>("svg");
    const [layout, setLayout] = useState<Partial<Layout>>({width: getPlotWidth(), height: getPlotHeight()});
    const [is3d, setIs3d] = useState<boolean>(false);
    const [config, setConfig] = useState<Partial<Config>>({
        scrollZoom: true,
        editable: true,
        showLink: true,
        plotlyServerURL: "https://chart-studio.plotly.com",
        responsive: true,
        showTips: true,
        displayModeBar: true,
        showEditInChartStudio: true,
        toImageButtonOptions: {
            format: selectedDownloadFormat
        }
    });
    
    useEffect(() => {
        if (Object.keys(visualizationData).length === 0) {
            return
        }
        const {data, type, colsAxisMapping} = visualizationData
        const axis: any = {}
        const hovertemplate: string[] = []
        const _layout: Partial<Plotly.Layout> = { ...layout, title: type}
        let _layoutLabels: any = {}
        let valuesLength = 0

        Object.entries(data).forEach(([col, values]) => {
            const label = (colsAxisMapping[col] ?? "").toLowerCase()
            axis[label] = values
            _layoutLabels[`${label}axis`] = {title: col}
            valuesLength = values.length
            hovertemplate.push(`<b>${col}</b>: %{${label}}`)
        })
        
        const graphAxis = Object.keys(axis)
        if (graphAxis.length === 1) {
            const label = ["x", "y", "z"].filter((val) => !graphAxis.includes(val))[0]
            const indexes = generateArray(valuesLength)
            axis[label] = indexes
            _layoutLabels[`${label}axis`] = {title: label}
        }

        const _data: Partial<PlotData> = {
            ...axis,
            type: graphAxis.length === 3 ? selectedPlotType : "scattergl",
            mode: selectedPlotMode,
            marker: {
                size: 12,
                line: {
                    color: 'rgba(217, 217, 217, 0.14)',
                    width: 0.5
                },
                opacity: 0.8,
            },
            hovertemplate: hovertemplate.join('<br>')
        }

        _layoutLabels = {
            ..._layoutLabels,
            scene: _layoutLabels
        }

        setIs3d(graphAxis.length === 3)
        setData(_data)
        setLayout({
            ..._layout,
            ..._layoutLabels
        })
    }, [visualizationData]);

    useEffect(() => {
        const resizeHandler = () => {
            setLayout({
                ...layout,
                width: getPlotWidth(),
                height: getPlotHeight(),
            })
        };
    
        window.addEventListener('resize', resizeHandler);
    
        // Cleanup function to remove the event listener when component unmounts
        return () => {
          window.removeEventListener('resize', resizeHandler);
        };
      }, []); // Empty dependency array ensures the effect runs only once

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

    const onFormatChange = (e: DropdownChangeEvent) => {
        setselectedDownloadFormat(e.value)
        const temp = config
        if (temp.toImageButtonOptions) {
            temp.toImageButtonOptions.format = e.value
            setConfig(temp)
        }
    }
  
    return (
        <div className="w-screen h-screen pt-7">
            <div className="w-full h-full">
                <div className='m-3'>
                    Select Plot Mode: <Dropdown value={selectedPlotMode} onChange={onModeChange} options={_plotModes} 
                        placeholder="Select Plot Mode" className="w-2 m-3" />
                    {
                        is3d ? (                        
                            <>
                                Select Plot Types: <Dropdown value={selectedPlotType} onChange={onTypeChange} options={_plotTypes3d} 
                                    placeholder="Select Plot Types" className="w-2 m-3" />
                            </>
                            ) : <></>
                    }
                    Download Format: <Dropdown value={selectedDownloadFormat} onChange={onFormatChange} options={_downloadFormats} 
                        placeholder="Select Download Format" className="w-2 m-3" />
                </div>

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