import { useEffect, useState } from 'react'
import classes from './geoMap.module.css'
import mapStyle from '../../../style/map.json'

import { useAppSelector } from '../../../store'

interface GeoMapProps {
  status: boolean
}

interface MapInstance {
  setCenter: (_: { lat: number; lng: number }) => void
}

export default function GeoMap(props: GeoMapProps) {
  const [isLoad, setIsLoad] = useState(false)
  const [map, setMap] = useState<MapInstance | null>(null)

  const originPlaceLat = useAppSelector((state) => state.address.originPlaceLat)
  const originPlaceLon = useAppSelector((state) => state.address.originPlaceLon)
  const destinationPlaceLat = useAppSelector((state) => state.address.destinationPlaceLat)
  const destinationPlaceLon = useAppSelector((state) => state.address.destinationPlaceLon)
  const focusInput = useAppSelector((state) => state.address.focusInput)

  const initMap = () => {
    const option = {
      disableDefaultUI: true,
      center: { lat: 25.033964, lng: 121.564472 },
      zoom: 17,
      clickableIcons: false,
      gestureHandling: 'greedy',
      styles: mapStyle,
    }
    console.log(focusInput)
    if (focusInput === 'origin') {
      option.center = { lat: originPlaceLat, lng: originPlaceLon }
    } else if (focusInput === 'destination') {
      option.center = { lat: destinationPlaceLat, lng: destinationPlaceLon }
    }

    setMap(new window.google.maps.Map(document.getElementById('map'), option))
    setIsLoad(true)
  }

  const handleInputSetCenter = () => {
    if (map) {
      if (focusInput === 'origin') {
        map.setCenter({ lat: originPlaceLat, lng: originPlaceLon })
      } else if (focusInput === 'destination') {
        map.setCenter({ lat: destinationPlaceLat, lng: destinationPlaceLon })
      }
    }
  }

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
    </div>
  )
}
