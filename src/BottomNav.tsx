import { useRef, useState } from 'react';
import { Dock } from 'primereact/dock';
import { Dialog } from 'primereact/dialog';
import { MenuItem } from 'primereact/menuitem';
import { FileUpload, FileUploadBeforeUploadEvent, FileUploadErrorEvent } from 'primereact/fileupload';
import { Tooltip } from 'primereact/tooltip';
import './BottomNav.css'
import uploadImage from "./assets/upload-6699084.svg";
import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
        

export default function BottomNav() {
    const [displayFileUploader, setDisplayFileUploader] = useState(true);
    const [type, setType] = useState<string>("capacity");
    
    const toast = useRef<Toast>(null);

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

    const showToastError = (message: string) => {
        toast?.current?.show({severity:'error', summary: 'Error', detail:message, life: 10_000});
    }

    const onBeforeUpload = (event: FileUploadBeforeUploadEvent) => {
        // Add custom data to the FormData object
        event.formData.append('type', type);
    };

    const onError = (event: FileUploadErrorEvent) => {
        showToastError(event.xhr.responseText)
    };

    return (
        <div className="dock">
            <Toast ref={toast} position="bottom-center" />

            <Tooltip target=".p-dock-action" position="top" />
            <Dock
                model={dockItems}
                position="right"/>
            <Dialog
                visible={displayFileUploader}
                header={'Upload File'}
                style={{ width: '40vw', height: '25rem' }}
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
                    name="files"
                    url={'http://localhost:5000/upload'}
                    accept="*/*"
                    mode="advanced"
                    multiple={true}
                    emptyTemplate={<p className="m-0">Drag and drop file here to upload.</p>}
                    onBeforeUpload={onBeforeUpload}
                    onError={onError}                    
                    />    
            </Dialog>
        </div>
    );
}
  