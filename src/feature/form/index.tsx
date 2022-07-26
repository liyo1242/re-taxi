import React, { useEffect } from 'react'
import { useScript } from '../../hook/useScript'

import { useAppDispatch } from '../../store'
import {
  setGoogleAutocompleteService,
  setGoogleGeocoderService,
  fetchPredictResultByWord,
} from '../../store/google'

export default function Form() {
  const dispatch = useAppDispatch()
  const [loaded] = useScript(
    `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_KEY}&libraries=places&callback=initMap`
  )

  useEffect(() => {
    if (loaded) {
      // * set google map instance to RTK
      console.log('set initMap function')
      window.initMap = () => {
        console.log('trigger initMap function')
        const autocompleteService = new window.google.maps.places.AutocompleteService()
        const geocoderService = new window.google.maps.Geocoder()
        dispatch(setGoogleAutocompleteService(autocompleteService))
        dispatch(setGoogleGeocoderService(geocoderService))
      }
    }
  }, [loaded])

  const handleTestGAPI = async () => {
    const resultAction = await dispatch(fetchPredictResultByWord('101'))
    console.log(resultAction)
  }

  return <div onClick={handleTestGAPI}>Form Component</div>
}
