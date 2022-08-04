import { useState } from 'react'
import classes from './geoForm.module.css'

interface GeoFromProps {
  status: boolean
}

export default function GeoFrom(props: GeoFromProps) {
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = () => {
    console.log('Submit')
  }

  return (
    <div className={`${classes.container} ${props.status ? '' : classes.hide}`}>
      <ul>
        <li>
          <h3>Phone</h3>
          <input value={phone} onChange={(event) => setPhone(event.target.value)} />
        </li>
        <li>
          <h3>Name</h3>
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </li>
      </ul>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  )
}
