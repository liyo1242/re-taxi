import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface AddressState {
  gpsPlaceLat: number
  gpsPlaceLon: number
  originPlace: string
  originPlaceFullText: string
  originPlaceLat: number
  originPlaceLon: number
  destinationPlace: string
  destinationPlaceFullText: string
  destinationPlaceLat: number
  destinationPlaceLon: number
  focusInput?: 'origin' | 'destination'
}

interface SetPlaceAction {
  address: string
  fullAddress: string
}

interface SetGeoAction {
  lat: number
  lon: number
}

const initialState: AddressState = {
  gpsPlaceLat: 0,
  gpsPlaceLon: 0,
  originPlace: '',
  originPlaceFullText: '',
  originPlaceLat: 0,
  originPlaceLon: 0,
  destinationPlace: '',
  destinationPlaceFullText: '',
  destinationPlaceLat: 0,
  destinationPlaceLon: 0,
}

export const setGpsTrace = createAsyncThunk('address/setGpsTrace', async (_, { dispatch }) => {
  // * high accuracy used first
  let watchId = 0
  const result = await new Promise((resolve) => {
    watchId = navigator.geolocation.watchPosition(
      (location) => {
        dispatch(setGpsPlace({ lat: location.coords.latitude, lon: location.coords.longitude }))
        navigator.geolocation.clearWatch(watchId)
        resolve(true)
      },
      (error) => {
        console.log('watchPosition error.code' + error.code)
        navigator.geolocation.clearWatch(watchId)
        resolve(false)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
      }
    )
  })
  return result
})

export const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setOrigin: (state, action: PayloadAction<SetPlaceAction>) => {
      state.originPlace = action.payload.address
      state.originPlaceFullText = action.payload.fullAddress
    },
    setOriginGeo: (state, action: PayloadAction<SetGeoAction>) => {
      state.originPlaceLat = action.payload.lat
      state.originPlaceLon = action.payload.lon
    },
    setDestination: (state, action: PayloadAction<SetPlaceAction>) => {
      state.destinationPlace = action.payload.address
      state.destinationPlaceFullText = action.payload.fullAddress
    },
    setDestinationGeo: (state, action: PayloadAction<SetGeoAction>) => {
      state.destinationPlaceLat = action.payload.lat
      state.destinationPlaceLon = action.payload.lon
    },
    setFocusStatus: (state, action: PayloadAction<'origin' | 'destination'>) => {
      state.focusInput = action.payload
    },
    setGpsPlace: (state, action: PayloadAction<SetGeoAction>) => {
      state.gpsPlaceLat = action.payload.lat
      state.gpsPlaceLon = action.payload.lon
    },
  },
})

export const {
  setFocusStatus,
  setOrigin,
  setOriginGeo,
  setDestination,
  setDestinationGeo,
  setGpsPlace,
} = addressSlice.actions

export default addressSlice.reducer
