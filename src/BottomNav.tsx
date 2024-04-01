import { useState } from 'react';
import { Dock } from 'primereact/dock';
import { Dialog } from 'primereact/dialog';
import { MenuItem } from 'primereact/menuitem';
import { FileUpload } from 'primereact/fileupload';
import { Tooltip } from 'primereact/tooltip';
import './BottomNav.css'
import uploadImage from "./assets/upload-6699084.svg";
import { RadioButton } from 'primereact/radiobutton';
        

export default function BottomNav() {
    const [displayFileUploader, setDisplayFileUploader] = useState(true);
    const [type, setType] = useState<string>("capacity");

    const dockItems: MenuItem[] = [
        {
            label: 'Upload File',
            icon: () => <img alt="Upload File" src={uploadImage} width="100%" />,
            command: () => {
                setDisplayFileUploader(true);
            },
        },
    ];

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
        setType(type);
    }


    return (
        <div className="dock">
            <Tooltip target=".p-dock-action" position="top" />
            <Dock
                model={dockItems}
                position="right"/>
            <Dialog
                visible={displayFileUploader}
                header={'Upload File'}
                style={{ width: '40vw', height: '22rem' }}
                onHide={() => setDisplayFileUploader(false)}
                blockScroll={true}>
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
                <FileUpload
                    name="file"
                    url={'http://localhost:5000/upload'}
                    accept="*/*"
                    mode="advanced"
                    emptyTemplate={<p className="m-0">Drag and drop file here to upload.</p>} />    
            </Dialog>
        </div>
    );
}
  