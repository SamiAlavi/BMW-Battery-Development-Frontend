import NavBar from './NavBar'
import SideBar from './SideBar';
import BottomNav from './BottomNav';
import { useState } from 'react';

export default function Dashboard() {
  const [isSidebarVisible, setSidebarVisible] = useState<boolean>(false);

  const onSidebarButtonClick = (value: boolean) => {
    setSidebarVisible(value);
  };
  
  return (
    <>
      <NavBar onSidebarButtonClick={onSidebarButtonClick} />
      <SideBar visible={isSidebarVisible} onSidebarButtonClick={onSidebarButtonClick}/>
      <BottomNav/>
    </>
  );
}
