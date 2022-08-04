import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface GoogleMapPredictPlaceModel {
  description: string
  structured_formatting: {
    main_text: string
  }
  place_id: string
}

interface GoogleMapGeoPlaceModel {
  formatted_address: string
  lat: string
  lng: string
  place_id: string
}

interface GoogleMapState {
  googleGeocoderService: any
  googleAutocompleteService: any
  googlePredictResult: PredictResultModel
}

const initialState: GoogleMapState = {
  googleGeocoderService: null,
  googleAutocompleteService: null,
  googlePredictResult: [],
}

type GeoResultModel = ReturnType<typeof geoResultFormat>

const geoResultFormat = (results: Array<GoogleMapGeoPlaceModel>) =>
  results.map((result) => ({
    full: result.formatted_address,
    lat: result.lat,
    lon: result.lng,
    id: result.place_id,
  }))

type PredictResultModel = ReturnType<typeof predictResultFormat>

const predictResultFormat = (results: Array<GoogleMapPredictPlaceModel>) =>
  results.map((result) => ({
    full: result.description,
    short: result.structured_formatting.main_text,
    id: result.place_id,
  }))

export const fetchPlaceByMatrix = createAsyncThunk<
  GeoResultModel,
  { lat: number; lon: number },
  { state: { google: { googleGeocoderService: any } } }
>('google/fetchPlaceByMatrix', async (Matrix, { getState }) => {
  const { googleGeocoderService: service } = getState().google
  const option = {
    location: { lat: Matrix.lat, lng: Matrix.lon },
    region: 'tw',
  }
  const response = await new Promise<Array<GoogleMapGeoPlaceModel>>((resolve) => {
    console.log('Because Geo API, cost money $0.05')
    service.geocode(option, (data, status) => {
      if (status === 'OK' && !!data[0]) resolve(data)
      resolve([])
    })
  })
  return geoResultFormat(response)
})

export const fetchPredictResultByWord = createAsyncThunk<
  PredictResultModel,
  string,
  { state: { google: { googleAutocompleteService: any } } }
>('google/fetchPredictResultByWord', async (word: string, { getState }) => {
  const { googleAutocompleteService: service } = getState().google
  // * TODO add option.bounds ( Map 4 corner )
  const option = {
    componentRestrictions: { country: 'tw' },
    input: word,
    type: 'establishment',
  }
  const response = await new Promise<Array<GoogleMapPredictPlaceModel>>((resolve) => {
    console.log('Because Places API, cost money $0.00283')
    service.getPlacePredictions(option, (data) => resolve(data))
  })
  return predictResultFormat(response)
})

export const googleSlice = createSlice({
  name: 'google',
  initialState,
  reducers: {
    setGoogleAutocompleteService: (state, action) => {
      state.googleAutocompleteService = action.payload
    },
    setGoogleGeocoderService: (state, action) => {
      state.googleGeocoderService = action.payload
    },
    setGooglePredictResult: (state, action) => {
      state.googlePredictResult = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPredictResultByWord.fulfilled, (state, action) => {
      state.googlePredictResult = action.payload
    })
  },
})

export const { setGoogleAutocompleteService, setGoogleGeocoderService, setGooglePredictResult } =
  googleSlice.actions

export default googleSlice.reducer
