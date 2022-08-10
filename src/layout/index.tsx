import React from 'react'
import { Outlet } from 'react-router-dom'
import Nav from './Nav'
// import SideBar from './SideBar'

export default function Layout() {
  return (
    <>
      <Nav />
      {/* <SideBar /> */}
      <Outlet />
    </>
  )
}
