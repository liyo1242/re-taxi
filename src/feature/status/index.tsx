import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../store'
import classes from './index.module.css'

export default function Status() {
  const originPlace = useAppSelector((state) => state.address.originPlace)
  const originPlaceLat = useAppSelector((state) => state.address.originPlaceLat)
  const originPlaceLon = useAppSelector((state) => state.address.originPlaceLon)
  const orderGuid = useAppSelector((state) => state.address.orderGuid)
  const destinationPlace = useAppSelector((state) => state.address.destinationPlace)
  const destinationPlaceLat = useAppSelector((state) => state.address.destinationPlaceLat)
  const destinationPlaceLon = useAppSelector((state) => state.address.destinationPlaceLon)
  const navigate = useNavigate()

  const handleCancel = () => {
    // * Normally, there is cancel order logic here
    navigate('/form', { replace: true })
  }

  return (
    <div className={classes.container}>
      <h2>Order is Processing....</h2>
      <span>OrderId: {orderGuid}</span>
      <span>OriginPlace: {originPlace}</span>
      <span>
        OriginGeo: ({originPlaceLat}, {originPlaceLon})
      </span>
      {destinationPlace && <span>destinationPlace: {destinationPlace}</span>}
      {destinationPlace && (
        <span>
          DestinationGeo: ({destinationPlaceLat}, {destinationPlaceLon})
        </span>
      )}
      <button onClick={handleCancel}>Cancel</button>
    </div>
  )
}
