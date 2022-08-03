import { useEffect, useState } from 'react'
import classes from './geoMap.module.css'
import mapStyle from '../../../style/map.json'

interface GeoMapProps {
  status: boolean
}

export default function GeoMap(props: GeoMapProps) {
  const [isLoad, setIsLoad] = useState(false)
  const [, setMap] = useState(null)

  // * create map instance from google global variable
  useEffect(() => {
    if (props.status && !isLoad) {
      setMap(
        new window.google.maps.Map(document.getElementById('map'), {
          disableDefaultUI: true,
          center: { lat: 25.033964, lng: 121.564472 },
          zoom: 17,
          clickableIcons: false,
          gestureHandling: 'greedy',
          styles: mapStyle,
        })
      )
      setIsLoad(true)
    }
  }, [props.status])

  return (
    <div className={`${classes.container} ${props.status ? '' : classes.hide}`}>
      <div id="map" style={{ width: '100%', height: '100%' }} />
    </div>
  )
}
