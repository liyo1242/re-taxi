import classes from './geoInput.module.css'
import { useAppDispatch, useAppSelector } from '../../../store'

import {
  fetchPredictResultByWord,
  fetchPlaceByMatrix,
  setGooglePredictResult,
  setMapBound,
} from '../../../store/google'
import { setFocusStatus, setOrigin, setOriginGeo, clearDestination } from '../../../store/address'
import { useEffect, useState } from 'react'
import { debounce } from '../../../utils'

interface GeoInputProps {
  watchStatus: boolean
  action: () => void
}

export default function GeoInput(props: GeoInputProps) {
  const [originInputValue, setOriginInputValue] = useState('')
  const [destinationInputValue, setDestinationInputValue] = useState('')
  const gpsPlaceLat = useAppSelector((state) => state.address.gpsPlaceLat)
  const gpsPlaceLon = useAppSelector((state) => state.address.gpsPlaceLon)
  const focusInput = useAppSelector((state) => state.address.focusInput)
  const originPlaceFullText = useAppSelector((state) => state.address.originPlaceFullText)
  const destinationPlaceFullText = useAppSelector((state) => state.address.destinationPlaceFullText)
  const dispatch = useAppDispatch()

  const handleOriginInputChange = (event) => {
    setOriginInputValue(event.target.value)
    _generatePredictResult(event.target.value)
  }

  const handleOriginFocus = () => {
    dispatch(setFocusStatus('origin'))
    _generatePredictResult(originInputValue)
    props.action()
  }

  const handleDestinationInputChange = (event) => {
    setDestinationInputValue(event.target.value)
    // * In Taxi Case, the destination info is option
    if (event.target.value === '') dispatch(clearDestination())
    _generatePredictResult(event.target.value)
  }

  const handleDestinationFocus = () => {
    dispatch(setFocusStatus('destination'))
    _generatePredictResult(destinationInputValue)
    props.action()
  }

  const _generatePredictResult = debounce(async (text: string) => {
    if (process.env.REACT_APP_ENABLE_PREDICT_RESULT !== 'true') {
      return
    }
    if (!text) {
      dispatch(setGooglePredictResult([]))
      return
    }
    await dispatch(fetchPredictResultByWord(text))
  }, +(process.env.REACT_APP_ENABLE_PREDICT_DELAY_TIME || 0))

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
      dispatch(
        setMapBound(
          new window.google.maps.LatLngBounds(
            new window.google.maps.LatLng(gpsPlaceLat - 0.0003618, gpsPlaceLon - 0.0015395),
            new window.google.maps.LatLng(gpsPlaceLat + 0.0003618, gpsPlaceLon + 0.0015395)
          )
        )
      )
    }
  }, [gpsPlaceLat, gpsPlaceLon])

  // * when the RTK data change, the comp state also change
  useEffect(() => {
    setOriginInputValue(originPlaceFullText)
  }, [originPlaceFullText])

  useEffect(() => {
    setDestinationInputValue(destinationPlaceFullText)
  }, [destinationPlaceFullText])

  // * when the result disappear, check input isValid
  useEffect(() => {
    if (!props.watchStatus) {
      if (focusInput === 'origin') {
        if (originInputValue !== originPlaceFullText) setOriginInputValue(originPlaceFullText)
      } else if (focusInput === 'destination') {
        if (destinationInputValue !== destinationPlaceFullText)
          setDestinationInputValue(destinationPlaceFullText)
      }
    }
  }, [props.watchStatus])

  return (
    <>
      <div className={classes.container}>
        <input
          className={classes.input}
          onFocus={handleOriginFocus}
          placeholder="The starting point of a happy journey"
          value={originInputValue}
          onChange={handleOriginInputChange}
        />
        <input
          className={classes.input}
          onFocus={handleDestinationFocus}
          placeholder="Where to have fun today ?"
          value={destinationInputValue}
          onChange={handleDestinationInputChange}
        />
      </div>
    </>
  )
}
