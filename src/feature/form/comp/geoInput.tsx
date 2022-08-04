import classes from './geoInput.module.css'
import { useAppDispatch, useAppSelector } from '../../../store'

import {
  fetchPredictResultByWord,
  fetchPlaceByMatrix,
  setGooglePredictResult,
} from '../../../store/google'
import { setFocusStatus, setOrigin, setOriginGeo } from '../../../store/address'
import { useEffect, useState } from 'react'

interface GeoInputProps {
  action: () => void
}

export default function GeoInput(props: GeoInputProps) {
  const [originInputValue, setOriginInputValue] = useState('')
  const [destinationInputValue, setDestinationInputValue] = useState('')
  const gpsPlaceLat = useAppSelector((state) => state.address.gpsPlaceLat)
  const gpsPlaceLon = useAppSelector((state) => state.address.gpsPlaceLon)
  const originPlaceFullText = useAppSelector((state) => state.address.originPlaceFullText)
  const destinationPlaceFullText = useAppSelector((state) => state.address.destinationPlaceFullText)
  const dispatch = useAppDispatch()

  const handleOriginInputChange = async (event) => {
    setOriginInputValue(event.target.value)
    const response = await dispatch(fetchPredictResultByWord(event.target.value))
    if (fetchPredictResultByWord.fulfilled.match(response)) {
      dispatch(setGooglePredictResult(response.payload))
    }
  }

  const handleOriginFocus = () => {
    dispatch(setFocusStatus('origin'))
    props.action()
  }

  const handleDestinationInputChange = async (event) => {
    setDestinationInputValue(event.target.value)
    const response = await dispatch(fetchPredictResultByWord(event.target.value))
    if (fetchPredictResultByWord.fulfilled.match(response)) {
      dispatch(setGooglePredictResult(response.payload))
    }
  }

  const handleDestinationFocus = () => {
    dispatch(setFocusStatus('destination'))
    props.action()
  }

  const handleGpsUpdateOriginInput = async (lat, lon) => {
    const response = await dispatch(fetchPlaceByMatrix({ lat, lon }))
    if (fetchPlaceByMatrix.fulfilled.match(response) && !!response.payload[0]) {
      dispatch(
        setOrigin({ address: response.payload[0].full, fullAddress: response.payload[0].full })
      )
      dispatch(setOriginGeo({ lat, lon }))
    }
  }

  // * when the gps is got, the comp state also change
  useEffect(() => {
    if (gpsPlaceLat && gpsPlaceLon) {
      handleGpsUpdateOriginInput(gpsPlaceLat, gpsPlaceLon)
    }
  }, [gpsPlaceLat, gpsPlaceLon])

  // * when the RTK data change, the comp state also change
  useEffect(() => {
    setOriginInputValue(originPlaceFullText)
  }, [originPlaceFullText])

  useEffect(() => {
    setDestinationInputValue(destinationPlaceFullText)
  }, [destinationPlaceFullText])

  return (
    <>
      <div className={classes.container}>
        <input
          className={classes.input}
          onFocus={handleOriginFocus}
          value={originInputValue}
          onChange={handleOriginInputChange}
        />
        <input
          className={classes.input}
          onFocus={handleDestinationFocus}
          value={destinationInputValue}
          onChange={handleDestinationInputChange}
        />
      </div>
    </>
  )
}
