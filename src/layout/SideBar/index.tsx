import React from 'react'
import classes from './sidebar.module.css'
import { Link } from 'react-router-dom'

import { useAppSelector } from '../../store'

export default function SideBar() {
  const sideBarStatus = useAppSelector((state) => state.layout.isSideBarOpen)
  return (
    <div className={`${classes.sideBar} ${sideBarStatus ? classes.active : ''}`}>
      <ul>
        <li>
          <Link to="/form">叫車主頁</Link>
        </li>
        <li>
          <Link to="/History">歷史紀錄</Link>
        </li>
      </ul>
    </div>
  )
}
