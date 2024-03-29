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

const SideBar: React.FC<Props> = ({ visible, onSidebarButtonClick }) => {
    const [selectedFile, setSelectedFile] = useState<CSV_File | null>(null);
    const [csvFiles, setCsvFiles] = useState<CSV_File[]>([]);
    const [type, setType] = useState<string>("capacity");

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
  
      fetchData();
    }, []);

    const customHeader = (
        <div className="flex align-items-center">
            <h2>Choose Data</h2>
        </div>
    );

    const onFileDropdownChange = (e: DropdownChangeEvent) => {
        setSelectedFile(e.value)
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
                    placeholder="Select a File" className="w-full" />
            </Sidebar>
        </div>
    )
}
  
export default SideBar;