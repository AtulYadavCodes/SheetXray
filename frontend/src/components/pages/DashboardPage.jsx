import React, { use } from 'react'


import Sidebar from '../sections/dashboardsection/Sidebar';
import { useLocation } from 'react-router';
import { Outlet } from 'react-router';
function DashboardPage() {

  const location = useLocation().pathname;
  return (
    <div className='flex h-full w-full'>
      {!(location.includes("files"))&&
      <Sidebar />}
      <div className="h-full w-full overflow-y-auto pt-1"><Outlet /> </div>
    </div>
  )
}

export default DashboardPage