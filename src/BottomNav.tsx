import { useState } from 'react';
import { Dock } from 'primereact/dock';
import { Dialog } from 'primereact/dialog';
import { MenuItem } from 'primereact/menuitem';
import { FileUpload } from 'primereact/fileupload';
import './BottomNav.css'
import uploadImage from "./assets/upload-6699084.svg";
        

export default function BottomNav() {
    const [displayFileUploader, setDisplayFileUploader] = useState(false);

    const dockItems: MenuItem[] = [
        {
            label: 'Upload File',
            icon: () => <img alt="Upload File" src={uploadImage} width="100%" />,
            command: () => {
                setDisplayFileUploader(true);
            }
        },
    ];


    return (
        <div className="dock">
            <Dock
                model={dockItems}/>
            <Dialog
                visible={displayFileUploader}
                header={'Upload File'}
                style={{ width: '30vw', height: '18rem' }}
                onHide={() => setDisplayFileUploader(false)}
                blockScroll={true}>
                <FileUpload
                    name="demo[]"
                    url={'/api/upload'}
                    accept="image/*"
                    mode="advanced"
                    emptyTemplate={<p className="m-0">Drag and drop file here to upload.</p>} />    
            </Dialog>
        </div>
    );
}
  