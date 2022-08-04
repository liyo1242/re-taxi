import classes from './geoResult.module.css'
import { useAppDispatch, useAppSelector } from '../../../store'
import { setOrigin, setDestination } from '../../../store/address'

interface GeoResultProps {
  action: () => void
  status: boolean
}

export default function GeoResult(props: GeoResultProps) {
  const dispatch = useAppDispatch()
  const results = useAppSelector((state) => state.google.googlePredictResult)
  const focusInput = useAppSelector((state) => state.address.focusInput)

  const handleClickPredictResult = (address: string, fullAddress: string) => {
    if (focusInput === 'origin') {
      dispatch(setOrigin({ address, fullAddress }))
    } else if (focusInput === 'destination') {
      dispatch(setDestination({ address, fullAddress }))
    }
  }

  return (
    <div className={`${classes.container} ${props.status ? '' : classes.hide}`}>
      <ul>
        {results.map((result) => (
          <li key={result.id} onClick={() => handleClickPredictResult(result.short, result.full)}>
            {result.full}
          </li>
        ))}
        <li onClick={props.action}>Choose From Map</li>
      </ul>
    </div>
  )
}
