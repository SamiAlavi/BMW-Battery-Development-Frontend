import { Sidebar } from 'primereact/sidebar';

interface Props {
    visible: boolean;
    onSidebarButtonClick: (value: boolean) => void;
}

const SideBar: React.FC<Props> = ({ visible, onSidebarButtonClick }) => {
    return (
        <div className="card flex justify-content-center">
            <Sidebar visible={visible} onHide={() => onSidebarButtonClick(false)} className="w-full md:w-20rem lg:w-30rem">
                <h2>Sidebar</h2>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            </Sidebar>
        </div>
    )
}
  
export default SideBar;