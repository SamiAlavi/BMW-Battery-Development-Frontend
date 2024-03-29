import NavBar from './NavBar'
import SideBar from './SideBar';
import BottomNav from './BottomNav';
import { useState } from 'react';
import ChartArea from './ChartArea';

export default function Dashboard() {
  const [isSidebarVisible, setSidebarVisible] = useState<boolean>(true);

  const onSidebarButtonClick = (value: boolean) => {
    setSidebarVisible(value);
  };
  
  return (
    <>
      <ChartArea/>
      <NavBar onSidebarButtonClick={onSidebarButtonClick} />
      <SideBar visible={isSidebarVisible} onSidebarButtonClick={onSidebarButtonClick}/>
      <BottomNav/>
    </>
  );
}
