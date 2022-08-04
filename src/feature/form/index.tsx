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
      <h2>Form Component</h2>
      <GepInput action={handleInputFocus} />
      <GeoResult status={isPredictShow} action={handleChoosePlaceFromMap} />
      <GeoMap status={isMapShow} />
      <GeoForm status={isFormShow} />
    </div>
  )
}
