import classes from './geoResult.module.css'
import { useAppDispatch, useAppSelector } from '../../../store'
import { setOrigin, setDestination, setOriginGeo, setDestinationGeo } from '../../../store/address'
import { useGetFavoriteAddressQuery, useGetHistoryAddressQuery } from '../../../store/api/address'

interface GeoResultProps {
  action: () => void
  return: () => void
  status: boolean
}

type GetArrayElement<T extends Array<any>> = T[number]

export default function GeoResult(props: GeoResultProps) {
  const dispatch = useAppDispatch()
  const results = useAppSelector((state) => state.google.googlePredictResult)
  const focusInput = useAppSelector((state) => state.address.focusInput)
  const { data: favoriteData } = useGetFavoriteAddressQuery(3)
  const { data: historyData } = useGetHistoryAddressQuery(2)

  const handleClickPredictResult = (address: string, fullAddress: string) => {
    if (focusInput === 'origin') {
      dispatch(setOrigin({ address, fullAddress }))
      dispatch(setOriginGeo({ lat: 0, lon: 0 }))
    } else if (focusInput === 'destination') {
      dispatch(setDestination({ address, fullAddress }))
      dispatch(setDestinationGeo({ lat: 0, lon: 0 }))
    }
    props.return()
  }

  const handleClickAddressApiResult = (
    addressResult: GetArrayElement<NonNullable<typeof favoriteData>>
  ) => {
    if (focusInput === 'origin') {
      dispatch(setOrigin({ address: addressResult.address, fullAddress: addressResult.address }))
      dispatch(setOriginGeo({ lat: addressResult.geo.lat, lon: addressResult.geo.lng }))
    } else if (focusInput === 'destination') {
      dispatch(
        setDestination({ address: addressResult.address, fullAddress: addressResult.address })
      )
      dispatch(setDestinationGeo({ lat: addressResult.geo.lat, lon: addressResult.geo.lng }))
    }
    props.return()
  }

  return (
    <div className={`${classes.container} ${props.status ? '' : classes.hide}`}>
      <ul>
        {results.length === 0 &&
          favoriteData?.map((result) => (
            <li key={result.id} onClick={() => handleClickAddressApiResult(result)}>
              {result.address}
            </li>
          ))}
        {results.length === 0 &&
          historyData?.map((result) => (
            <li key={result.id} onClick={() => handleClickAddressApiResult(result)}>
              {result.address}
            </li>
          ))}
        {results.map((result) => (
          <li key={result.id} onClick={() => handleClickPredictResult(result.short, result.full)}>
            {result.full}
          </li>
        ))}
        {process.env.REACT_APP_ENABLE_MAP === 'true' && (
          <li className={classes.action} onClick={props.action}>
            Choose From Map
          </li>
        )}
      </ul>
    </div>
  )
}
