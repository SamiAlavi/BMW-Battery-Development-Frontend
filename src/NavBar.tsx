import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';

interface Props {
    onSidebarButtonClick: (value: boolean) => void;
}


const NavBar: React.FC<Props> = ({ onSidebarButtonClick }) =>  {
    const items: MenuItem[] = []

    const start = (
        <div className="flex align-items-center gap-2">
            <Button icon="pi pi-align-justify" rounded text severity="secondary" aria-label="Choose Data" onClick={() => onSidebarButtonClick(true)} tooltip='Choose Data' />
            <img alt="logo" src="https://primefaces.org/cdn/primereact/images/logo.png" height="40" className="mr-2"></img>
            PRIME REACT
        </div>
    );
    const end = (
        <div className="flex align-items-center gap-2">
            <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle" />
        </div>
    );

    return (
        <div className="card">
            <Menubar model={items} start={start} end={end} />
        </div>
    );
}
  
export default NavBar;