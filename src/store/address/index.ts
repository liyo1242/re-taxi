import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { fetchPlaceByAddress } from '../google'
import type { GoogleMapState } from '../google'
import type { PostTaxiOrder } from '../api/address'

export interface AddressState {
  gpsPlaceLat: number
  gpsPlaceLon: number
  originPlace: string
  originPlaceFullText: string
  originPlaceLat: number
  originPlaceLon: number
  isOriginPlaceGeoValid: boolean
  destinationPlace: string
  destinationPlaceFullText: string
  destinationPlaceLat: number
  destinationPlaceLon: number
  isDestinationPlaceGeoValid: boolean
  focusInput?: 'origin' | 'destination'
  option: {
    name?: string
    phone?: string
  }
  orderGuid: string
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
  isOriginPlaceGeoValid: false,
  destinationPlace: '',
  destinationPlaceFullText: '',
  destinationPlaceLat: 0,
  destinationPlaceLon: 0,
  isDestinationPlaceGeoValid: false,
  option: {},
  orderGuid: '',
}

export const setGpsTrace = createAsyncThunk('address/setGpsTrace', async (_, { dispatch }) => {
  // * high accuracy used first
  let watchId = 0
  await new Promise((resolve) => {
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
})

export const createOrder = createAsyncThunk<
  PostTaxiOrder,
  { phone: string; name: string },
  { state: { address: AddressState; google: GoogleMapState } }
>('address/createOrder', async (option, { getState, dispatch }) => {
  console.log('process Middleware')
  const {
    originPlace,
    originPlaceLat,
    originPlaceLon,
    isOriginPlaceGeoValid,
    destinationPlace,
    destinationPlaceLat,
    destinationPlaceLon,
    isDestinationPlaceGeoValid,
  } = getState().address
  let originGeo = {},
    destinationGeo = {}
  dispatch(setOption(option))
  if (originPlace && !isOriginPlaceGeoValid) {
    console.log('process origin place')
    // * dispatch api trans text to geo
    const response = await dispatch(fetchPlaceByAddress(originPlace))
    if (fetchPlaceByAddress.fulfilled.match(response)) {
      const geo = {
        lat: response.payload[0].lat,
        lon: response.payload[0].lon,
      }
      originGeo = geo
      dispatch(setOriginGeo(geo))
    }
  }

  if (destinationPlace && !isDestinationPlaceGeoValid) {
    console.log('process destination place')
    // * dispatch api trans text to geo
    const response = await dispatch(fetchPlaceByAddress(destinationPlace))
    if (fetchPlaceByAddress.fulfilled.match(response)) {
      const geo = {
        lat: response.payload[0].lat,
        lon: response.payload[0].lon,
      }
      destinationGeo = geo
      dispatch(setDestinationGeo(geo))
    }
  }
  return {
    ...option,
    origin: {
      address: originPlace,
      lat: originPlaceLat,
      lon: originPlaceLon,
      ...originGeo,
    },
    destination: destinationPlace
      ? {
          address: destinationPlace,
          lat: destinationPlaceLat,
          lon: destinationPlaceLon,
          ...destinationGeo,
        }
      : undefined,
  }
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
      if (action.payload.lat && action.payload.lon) state.isOriginPlaceGeoValid = true
      else state.isOriginPlaceGeoValid = false
    },
    setDestination: (state, action: PayloadAction<SetPlaceAction>) => {
      state.destinationPlace = action.payload.address
      state.destinationPlaceFullText = action.payload.fullAddress
    },
    setDestinationGeo: (state, action: PayloadAction<SetGeoAction>) => {
      state.destinationPlaceLat = action.payload.lat
      state.destinationPlaceLon = action.payload.lon
      if (action.payload.lat && action.payload.lon) state.isDestinationPlaceGeoValid = true
      else state.isDestinationPlaceGeoValid = false
    },
    setFocusStatus: (state, action: PayloadAction<'origin' | 'destination'>) => {
      state.focusInput = action.payload
    },
    setGpsPlace: (state, action: PayloadAction<SetGeoAction>) => {
      state.gpsPlaceLat = action.payload.lat
      state.gpsPlaceLon = action.payload.lon
    },
    setOption: (state, action: PayloadAction<{ name: string; phone: string }>) => {
      state.option.name = action.payload.name
      state.option.phone = action.payload.phone
    },
    setOrderId: (state, action: PayloadAction<string>) => {
      state.orderGuid = action.payload
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
  setOption,
  setOrderId,
} = addressSlice.actions

export default addressSlice.reducer
