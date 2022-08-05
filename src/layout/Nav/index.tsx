import React from 'react'
import classes from './nav.module.css'

import { useAppDispatch, useAppSelector } from '../../store'
import { toggleSideBar } from '../../store/layout'

export default function Nav() {
  const dispatch = useAppDispatch()
  const cost = useAppSelector((state) => state.google.cost)

  const handleClickMenu = () => {
    dispatch(toggleSideBar())
  }

  return (
    <div className={classes.nav} onClick={handleClickMenu}>
      <div className={classes.menu}>
        <span />
      </div>
      <p className={classes.money}>Google API Total Cost: {cost}</p>
    </div>
  )
}
