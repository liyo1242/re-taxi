import { useEffect, useState } from 'react'
import classes from './geoMap.module.css'
import mapStyle from '../../../style/map.json'
import FlagIcon from './flag'

import { useAppSelector, useAppDispatch } from '../../../store'
import { fetchPlaceByMatrix, fetchPlaceByAddress } from '../../../store/google'
import { setOrigin, setOriginGeo, setDestination, setDestinationGeo } from '../../../store/address'

interface GeoMapProps {
  status: boolean
}

interface MapInstance {
  setCenter: (_: { lat: number; lng: number }) => void
  getCenter: () => { lat: () => number; lng: () => number }
}

export default function GeoMap(props: GeoMapProps) {
  const [isLoad, setIsLoad] = useState(false)
  const [map, setMap] = useState<MapInstance | null>(null)
  const [isDrag, setIsDrag] = useState(false)

  const dispatch = useAppDispatch()
  const gpsPlaceLat = useAppSelector((state) => state.address.gpsPlaceLat)
  const gpsPlaceLon = useAppSelector((state) => state.address.gpsPlaceLon)
  const originPlaceFullText = useAppSelector((state) => state.address.originPlaceFullText)
  const originPlaceLat = useAppSelector((state) => state.address.originPlaceLat)
  const originPlaceLon = useAppSelector((state) => state.address.originPlaceLon)
  const destinationPlaceFullText = useAppSelector((state) => state.address.destinationPlaceFullText)
  const destinationPlaceLat = useAppSelector((state) => state.address.destinationPlaceLat)
  const destinationPlaceLon = useAppSelector((state) => state.address.destinationPlaceLon)
  const focusInput = useAppSelector((state) => state.address.focusInput)

  const initMap = () => {
    const option = {
      disableDefaultUI: true,
      center: { lat: gpsPlaceLat || 25.033964, lng: gpsPlaceLon || 121.564472 },
      zoom: 17,
      clickableIcons: false,
      gestureHandling: 'greedy',
      styles: mapStyle,
    }

    const mapInstance = new window.google.maps.Map(document.getElementById('map'), option)
    // * add map gesture listener
    mapInstance.addListener('drag', () => setIsDrag(true))
    mapInstance.addListener('dragend', () => setIsDrag(false))
    handleInputSetCenter(mapInstance)
    setMap(mapInstance)
    setIsLoad(true)
  }

  const handleInputSetCenter = async (mapInstance?: MapInstance) => {
    if (process.env.REACT_APP_ENABLE_MAP_AUTO_MOVE_CENTER_ACCORDING_INPUT !== 'true') {
      return
    }
    // * handle init map first judgement
    let mapIns: MapInstance | null
    if (mapInstance) mapIns = mapInstance
    else mapIns = map // * comp state

    if (mapIns) {
      if (focusInput === 'origin') {
        if (originPlaceFullText) {
          if (!(originPlaceLat && originPlaceLon)) {
            const response = await dispatch(fetchPlaceByAddress(originPlaceFullText))
            if (fetchPlaceByAddress.fulfilled.match(response) && !!response.payload[0]) {
              mapIns.setCenter({ lat: response.payload[0].lat, lng: response.payload[0].lon })
              dispatch(setOriginGeo({ lat: response.payload[0].lat, lon: response.payload[0].lon }))
            }
          } else {
            mapIns.setCenter({ lat: originPlaceLat, lng: originPlaceLon })
          }
        }
      } else if (focusInput === 'destination') {
        if (destinationPlaceFullText) {
          if (!(destinationPlaceLat && destinationPlaceLon)) {
            const response = await dispatch(fetchPlaceByAddress(destinationPlaceFullText))
            if (fetchPlaceByAddress.fulfilled.match(response) && !!response.payload[0]) {
              mapIns.setCenter({ lat: response.payload[0].lat, lng: response.payload[0].lon })
              dispatch(
                setDestinationGeo({
                  lat: response.payload[0].lat,
                  lon: response.payload[0].lon,
                })
              )
            }
          } else {
            mapIns.setCenter({ lat: destinationPlaceLat, lng: destinationPlaceLon })
          }
        }
      }
    }
  }

  const handleMapDragEndSetCenterAddress = async () => {
    if (map) {
      const center = {
        lat: map.getCenter().lat(),
        lon: map.getCenter().lng(),
      }
      const response = await dispatch(fetchPlaceByMatrix(center))
      if (fetchPlaceByMatrix.fulfilled.match(response) && !!response.payload[0]) {
        if (focusInput === 'origin') {
          dispatch(
            setOrigin({ address: response.payload[0].full, fullAddress: response.payload[0].full })
          )
          dispatch(setOriginGeo(center))
        } else if (focusInput === 'destination') {
          dispatch(
            setDestination({
              address: response.payload[0].full,
              fullAddress: response.payload[0].full,
            })
          )
          dispatch(setDestinationGeo(center))
        }
      }
    }
  }

  // * replace listener effect
  useEffect(() => {
    if (!isDrag) {
      handleMapDragEndSetCenterAddress()
    }
  }, [isDrag])

  // * create map instance from google global variable
  useEffect(() => {
    if (props.status && !isLoad) {
      initMap()
    } else if (props.status && isLoad) {
      handleInputSetCenter()
    }
  }, [props.status])

  return (
    <div className={`${classes.container} ${props.status ? '' : classes.hide}`}>
      <div id="map" style={{ width: '100%', height: '100%' }} />
      <FlagIcon active={isDrag} />
    </div>
  )
}
