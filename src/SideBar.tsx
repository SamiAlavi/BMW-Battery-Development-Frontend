import { Sidebar } from 'primereact/sidebar';
import './SideBar.css'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { useEffect, useState } from 'react';
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
                    
                <Dropdown value={selectedFile} onChange={onFileDropdownChange} options={csvFiles} optionLabel="filename" optionValue='id' 
                    placeholder="Select a File" className="w-full" />
            </Sidebar>
        </div>
    )
}
  
export default SideBar;