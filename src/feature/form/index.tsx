import React, { useEffect, useState } from 'react'
import { useScript } from '../../hook/useScript'

import { useAppDispatch } from '../../store'
import { setGoogleAutocompleteService, setGoogleGeocoderService } from '../../store/google'
import { setGpsTrace } from '../../store/address'

import GepInput from './comp/geoInput'
import GeoMap from './comp/geoMap'
import GeoResult from './comp/geoResult'
import GeoForm from './comp/geoForm'

import classes from './index.module.css'

export default function Form() {
  const dispatch = useAppDispatch()
  const [loaded] = useScript(
    `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_KEY}&libraries=places&callback=initMap`
  )

  const [isPredictShow, setIsPredictShow] = useState(false)
  const [isMapShow, setIsMapShow] = useState(false)
  const [isFormShow, setIsFormShow] = useState(true)

  const handleChoosePlaceFromMap = () => {
    setIsPredictShow(false)
    setIsMapShow(true)
  }

  const handleInputFocus = () => {
    setIsPredictShow(true)
    setIsMapShow(false)
    setIsFormShow(false)
  }

  const handleReturn = () => {
    if (isPredictShow) {
      setIsPredictShow(false)
      setIsFormShow(true)
    }
    if (isMapShow) {
      setIsPredictShow(true)
      setIsMapShow(false)
    }
  }

  useEffect(() => {
    if (loaded) {
      dispatch(setGpsTrace())
      window.initMap = () => {
        const autocompleteService = new window.google.maps.places.AutocompleteService()
        const geocoderService = new window.google.maps.Geocoder()
        dispatch(setGoogleAutocompleteService(autocompleteService))
        dispatch(setGoogleGeocoderService(geocoderService))
      }
    }
  }, [loaded])

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <IsShowCompoment isShow={!isFormShow} time={300}>
          <div className={classes.return} onClick={handleReturn}>
            <span />
            <p>Previous</p>
          </div>
        </IsShowCompoment>
        <h2>Call Taxi</h2>
      </div>
      <GepInput action={handleInputFocus} />
      <GeoResult status={isPredictShow} action={handleChoosePlaceFromMap} />
      <GeoMap status={isMapShow} />
      <GeoForm status={isFormShow} />
    </div>
  )
}

import { PropsWithChildren } from 'react'

interface IsShowCompomentProps {
  time: number
  isShow: boolean
}

function IsShowCompoment(props: PropsWithChildren<IsShowCompomentProps>) {
  const style = {
    transition: props.time / 1000 + 's',
    opacity: props.isShow ? '1' : '0',
  }

  return <div style={style}>{props.children}</div>
}
