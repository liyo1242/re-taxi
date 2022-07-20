import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface AddressState {
  originPlace: string
  originPlaceFullText: string
  originPlaceLat: number
  originPlaceLon: number
  destinationPlace: string
  destinationPlaceFullText: string
  destinationPlaceLat: number
  destinationPlaceLon: number
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
  originPlace: '',
  originPlaceFullText: '',
  originPlaceLat: 0,
  originPlaceLon: 0,
  destinationPlace: '',
  destinationPlaceFullText: '',
  destinationPlaceLat: 0,
  destinationPlaceLon: 0,
}

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
  },
})

export const { setOrigin, setOriginGeo, setDestination, setDestinationGeo } = addressSlice.actions

export default addressSlice.reducer
