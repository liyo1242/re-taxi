import { useState } from 'react'
import classes from './geoForm.module.css'
import { useAppDispatch } from '../../../store'
import { createOrder, setOrderId } from '../../../store/address'
import LoadingIcon from './loading'
import { usePostTaxiOrderMutation } from '../../../store/api/address'
import { useNavigate } from 'react-router-dom'

import { useNotify } from '../../../hook/useNotify'

interface GeoFromProps {
  status: boolean
}
// TODO fix Complexity from 19 to the 15
export default function GeoForm(props: GeoFromProps) {
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [checkRequire, setCheckRequire] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const dispatch = useAppDispatch()
  const [postTaxiOrder] = usePostTaxiOrderMutation()
  const navigate = useNavigate()
  const { show: showErrorNotify, NotificationModel } = useNotify('alert')

  const handleSubmit = async () => {
    setCheckRequire(true)
    if (checkPhoneNumber(phone) && name) {
      setSubmitLoading(true)
      const response = await dispatch(createOrder({ phone, name }))
      if (createOrder.fulfilled.match(response)) {
        const result = await postTaxiOrder(response.payload)
        // * Normally, it should return guid
        setSubmitLoading(false)
        if ('data' in result) {
          dispatch(setOrderId(result.data.id))
          navigate('/status', { replace: true })
        } else {
          showErrorNotify()
        }
      }
    }
  }

  const checkPhoneNumber = (str) => {
    const reg2 = /(^09\d{2}-?\d{3}-?\d{3}$)|(^((\+886)|(886))\s?(9)\d{2}\s?\d{3}\s?\d{3}$)/
    if (str.length < 10 || str.length > 18) {
      return false
    } else {
      return reg2.exec(str)
    }
  }

  return (
    <>
      <div className={`${classes.container} ${props.status ? '' : classes.hide}`}>
        <ul>
          <li>
            <h3>Phone</h3>
            <input
              className={checkRequire && !checkPhoneNumber(phone) ? classes.inValid : ''}
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </li>
          <li>
            <h3>Name</h3>
            <input
              className={checkRequire && !name ? classes.inValid : ''}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </li>
        </ul>
        {props.status && (
          <button onClick={handleSubmit}>
            <span>Submit</span>
            <em>
              <LoadingIcon size={20} active={submitLoading} />
            </em>
          </button>
        )}
      </div>
      <NotificationModel>Submit Failed</NotificationModel>
    </>
  )
}
