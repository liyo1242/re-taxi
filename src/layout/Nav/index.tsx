import React from 'react'
import classes from './nav.module.css'

import { useAppDispatch } from '../../store'
import { toggleSideBar } from '../../store/layout'

export default function Nav() {
  const dispatch = useAppDispatch()

  const handleClickMenu = () => {
    dispatch(toggleSideBar())
  }

  return (
    <div className={classes.nav} onClick={handleClickMenu}>
      <div className={classes.menu}>
        <span />
      </div>
    </div>
  )
}
