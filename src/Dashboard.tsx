import NavBar from './NavBar'
import SideBar from './SideBar';
import BottomNav from './BottomNav';
import { useState } from 'react';
import ChartArea from './ChartArea';

export default function Dashboard() {
  const [isSidebarVisible, setSidebarVisible] = useState<boolean>(true);
  const [visualizationData, setVisualizationData] = useState<any>({});

  const onSidebarButtonClick = (value: boolean) => {
    setSidebarVisible(value);
  };
  
  return (
    <>
      <ChartArea visualizationData={visualizationData}/>
      <NavBar onSidebarButtonClick={onSidebarButtonClick} />
      <SideBar visible={isSidebarVisible} onSidebarButtonClick={onSidebarButtonClick} setVisualizationData={setVisualizationData}/>
      <BottomNav/>
    </>
  );
}
