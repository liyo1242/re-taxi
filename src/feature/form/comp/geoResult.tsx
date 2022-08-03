import classes from './geoResult.module.css'
import { useAppSelector } from '../../../store'

interface GeoResultProps {
  action: () => void
  status: boolean
}

export default function GeoResult(props: GeoResultProps) {
  const results = useAppSelector((state) => state.google.googlePredictResult)
  return (
    <div className={`${classes.container} ${props.status ? '' : classes.hide}`}>
      <ul>
        {results.map((result) => (
          <li key={result.id}>{result.full}</li>
        ))}
        <li onClick={props.action}>Choose From Map</li>
      </ul>
    </div>
  )
}
