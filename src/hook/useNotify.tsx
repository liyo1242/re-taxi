import { memo, useEffect, useRef, useState } from 'react'
import type { PropsWithChildren } from 'react'
import ReactDOM from 'react-dom'
import classes from './notify.module.css'

interface NotificationProps {
  type: 'alert' | 'info'
  close: () => void
}

const Notification = memo((props: PropsWithChildren<NotificationProps>) => {
  const container = useRef(document.createElement('div'))

  useEffect(() => {
    document.documentElement.appendChild(container.current)
    container.current.style.position = 'absolute'
    container.current.style.top = '0'
    container.current.style.left = '0'
    return () => {
      document.documentElement.removeChild(container.current)
    }
  }, [props.children])

  return ReactDOM.createPortal(
    <div
      className={`${classes.container} ${props.type ? classes[props.type] : ''}`}
      onClick={props.close}
    >
      {props.children}
    </div>,
    container.current
  )
})
Notification.displayName = 'Notification'

export const useNotify = (type: NotificationProps['type']) => {
  const [active, setActive] = useState(false)

  const show = () => setActive(true)
  const hide = () => setActive(false)

  useEffect(() => {
    let timer
    if (active) timer = setTimeout(() => setActive(false), 2000)
    return () => clearTimeout(timer)
  }, [active])

  const NotificationModel = (props: PropsWithChildren) =>
    active ? (
      <Notification type={type} close={hide}>
        {props.children}
      </Notification>
    ) : null

  return {
    show,
    NotificationModel,
  }
}
