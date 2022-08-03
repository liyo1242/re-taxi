import classes from './geoInput.module.css'
import { useAppDispatch } from '../../../store'

import { fetchPredictResultByWord, setGooglePredictResult } from '../../../store/google'
import { useState } from 'react'

interface GeoInputProps {
  action: () => void
}

export default function GeoInput(props: GeoInputProps) {
  const [inputValue, setInputValue] = useState('')
  const dispatch = useAppDispatch()

  const handleInputChange = async (event) => {
    setInputValue(event.target.value)
    const response = await dispatch(fetchPredictResultByWord(event.target.value))
    if (fetchPredictResultByWord.fulfilled.match(response)) {
      dispatch(setGooglePredictResult(response.payload))
    }
  }

  return (
    <>
      <div className={classes.container}>
        <input
          className={classes.input}
          onFocus={props.action}
          value={inputValue}
          onChange={handleInputChange}
        />
        <input className={classes.input} />
      </div>
    </>
  )
}
