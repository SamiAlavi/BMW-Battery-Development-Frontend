import { Sidebar } from 'primereact/sidebar';
import './SideBar.css'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { useEffect, useRef, useState } from 'react';
import { RadioButton } from 'primereact/radiobutton';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
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
    [key: string]: string | undefined;
};

const SideBar: React.FC<Props> = ({ visible, onSidebarButtonClick }) => {
    const [selectedFile, setSelectedFile] = useState<number | null>(null);
    const [csvFiles, setCsvFiles] = useState<CSV_File[]>([]);
    const [type, setType] = useState<string>("capacity");
    const [columnsCapacity, setColumnsCapacity] = useState<string[]>([]);
    const [columnsCycle, setColumnsCycle] = useState<string[]>([]);
    const [colsAxisMapping, setColsAxisMapping] = useState<ColAxisMap>({});
    const [selectedTypeColumns, setSelectedTypeColumns] = useState<string[]>([]);
    
    const toast = useRef<Toast>(null);

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
        const cols = type==="capacity" ? columnsCapacity : columnsCycle
        setSelectedTypeColumns(cols)
        resetColsAxisMapping(cols)
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
                const cols = response.data
                setColumnsCapacity(cols);
                setSelectedTypeColumns(cols)
                resetColsAxisMapping(cols)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        const fetchColumnsCycle = async () => {
            try {
                const response = await axiosInstance.get('columns/cycle');
                const cols = response.data
                setColumnsCycle(cols);
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
        const temp: ColAxisMap = {}
        cols.forEach((col) => {
            temp[col] = undefined;
        })
        setColsAxisMapping(temp)
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

    const showToastError = (message: string) => {
        toast?.current?.show({severity:'error', summary: 'Error', detail:message, life: 10_000});
    }

    const validate = () => {
        if (!selectedFile) {
            return {
                error: true,
                message: "No File Chosen"
            }
        }

        const values = Object.values(colsAxisMapping);
        const uniqueValues = [...new Set(values)]

        if (!uniqueValues.some((val) => val)) {
            return {
                error: true,
                message: "Choose atleast 1 axis"
            }
        }

        if (uniqueValues.length !== values.length) {
            return {
                error: true,
                message: "Multiple columns cannot be mapped to same axis"
            }
        }
        return  {
            error: false,
            message: ""
        }
        
    }

    const visualize = async () => {
        const {error, message} = validate()
        if (error) {
            showToastError(message)
            return
        }
        const cols: string[] = []
        Object.entries(colsAxisMapping).forEach(([col, value]) => {
            if (value) {
                cols.push(col)
            }
        })
        const body = {
            file_id: selectedFile,
            type: type,
            cols: cols,
        }
        const response = await axiosInstance.post('visualize', body);
    }


    return (<>        
        <Toast ref={toast} position="bottom-center" />
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

                <table border={0} className='w-full'>
                    <tbody>
                        {
                            selectedTypeColumns.map((col) => {
                                return <tr className='vertical-align-baseline'>
                                    <td className='w-5'>
                                        {col}
                                    </td>
                                    <td>
                                        <Dropdown value={colsAxisMapping[col]} onChange={(e) => onAxisChange(e.value, col)} options={axis} 
                                            placeholder="Select Axis" className="w-full mb-3" showClear={true}/>
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
                <div className='w-full text-center'>                    
                    <Button icon="pi pi-check" aria-label="Visualize" onClick={visualize} label='Visualize' />
                </div>
            </Sidebar>
        </div>
        
    </>)
}
  
export default SideBar;