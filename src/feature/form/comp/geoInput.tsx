import classes from './geoInput.module.css'
import { useAppDispatch, useAppSelector } from '../../../store'

import {
  fetchPredictResultByWord,
  fetchPlaceByMatrix,
  setGooglePredictResult,
  setMapBound,
} from '../../../store/google'
import { setFocusStatus, setOrigin, setOriginGeo } from '../../../store/address'
import { useEffect, useState } from 'react'
import { debounce } from '../../../utils'

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
          window.google.maps.LatLngBounds(
            window.google.maps.LatLng(gpsPlaceLat - 0.0003618, gpsPlaceLon - 0.0015395),
            window.google.maps.LatLng(gpsPlaceLat + 0.0003618, gpsPlaceLon + 0.0015395)
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
