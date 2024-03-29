import { Sidebar } from 'primereact/sidebar';
import './SideBar.css'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { useEffect, useState } from 'react';
import { RadioButton } from 'primereact/radiobutton';
import axiosInstance from './axiosInstance'

interface Props {
    visible: boolean;
    onSidebarButtonClick: (value: boolean) => void;
}
interface CSV_File {
    id: number;
    filename: string;
    type: string;
    timestamp: string;
}

type ColAxisMap = {
    [key: string]: string | null;
};

const SideBar: React.FC<Props> = ({ visible, onSidebarButtonClick }) => {
    const [selectedFile, setSelectedFile] = useState<CSV_File | null>(null);
    const [csvFiles, setCsvFiles] = useState<CSV_File[]>([]);
    const [type, setType] = useState<string>("capacity");
    const [columnsCapacity, setColumnsCapacity] = useState<string[]>([]);
    const [columnsCycle, setColumnsCycle] = useState<string[]>([]);
    const [colsAxisMapping, setColsAxisMapping] = useState<ColAxisMap>({});

    const radioButtons = [
        {
            label: "Capacity",
            value: "capacity",
        },
        {
            label: "Cycle",
            value: "cycle",
        }
    ]

    const axis = ["X", "Y", "Z"]

    const updateType = (type: string) => {
        setSelectedFile(null);
        setType(type);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('csv_data');
                setCsvFiles(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        const fetchColumnsCapacity = async () => {
            try {
                const response = await axiosInstance.get('columns/capacity');
                setColumnsCapacity(response.data);
                resetColsAxisMapping(response.data)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        const fetchColumnsCycle = async () => {
            try {
                const response = await axiosInstance.get('columns/cycle');
                setColumnsCycle(response.data);
                resetColsAxisMapping(response.data)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
  
        fetchData();
        fetchColumnsCapacity();
        fetchColumnsCycle();
    }, []);

    const customHeader = (
        <div className="flex align-items-center">
            <h2>Choose Data</h2>
        </div>
    );

    const resetColsAxisMapping = (cols: string[]) => {
        setColsAxisMapping({})
        cols.forEach((col) => {
            colsAxisMapping[col] = "X";
        })

    }

    const onFileDropdownChange = (e: DropdownChangeEvent) => {
        setSelectedFile(e.value)
    }

    const onAxisChange = (axis: string, col: string) => {
        setColsAxisMapping({
            ...colsAxisMapping,
            [col]: axis,
        })
    }


    return (
        <div className="sidebar-container">
            <Sidebar
                visible={visible}
                onHide={() => onSidebarButtonClick(false)}
                className="glass-sidebar w-full md:w-20rem lg:w-30rem"
                header={customHeader}>
                <div className="flex flex-wrap gap-3 mb-3">
                    {
                        radioButtons.map((btn) => {
                            return <>
                                <RadioButton inputId={btn.value} name={btn.label} value={btn.value} onChange={(e) => updateType(e.value)} checked={type === btn.value} />
                                <label htmlFor={btn.value} className="ml-2">{btn.label}</label>
                            </>
                        })
                    }
                </div>
                    
                <Dropdown value={selectedFile} onChange={onFileDropdownChange} options={csvFiles.filter((val) => val.type===type)} optionLabel="filename" optionValue='id' 
                    placeholder="Select a File" className="w-full mb-3" />

                <table border={1} className='w-full'>
                    <tbody>
                        {
                            type === "capacity" ? (
                                columnsCapacity.map((col) => {
                                    return <tr className='vertical-align-baseline'>
                                        <td className='w-5'>
                                            {col}
                                        </td>
                                        <td>
                                            <Dropdown value={colsAxisMapping[col]} onChange={(e) => onAxisChange(e.value, col)} options={axis} 
                                                placeholder="Select Axis" className="w-full mb-3" />
                                        </td>
                                    </tr>
                                })
                            ) : <></>
                        }
                    </tbody>
                </table>
            </Sidebar>
        </div>
    )
}
  
export default SideBar;