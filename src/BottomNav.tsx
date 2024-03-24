import { useState } from 'react';
import { Dock } from 'primereact/dock';
import { Dialog } from 'primereact/dialog';
import { MenuItem } from 'primereact/menuitem';
        

export default function BottomNav() {
    const [displayFileUploader, setDisplayFileUploader] = useState(false);

    const dockItems: MenuItem[] = [
        {
            label: 'Finder',
            icon: () => <img alt="Finder" src="https://primefaces.org/cdn/primereact/images/dock/finder.svg" width="100%" />,
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
                style={{ width: '30vw', height: '18rem' }}
                onHide={() => setDisplayFileUploader(false)}
                maximizable blockScroll={true}>
            </Dialog>
        </div>
    );
}
  