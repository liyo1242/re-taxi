import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface GoogleMapPlaceModel {
  description: string
  structured_formatting: {
    main_text: string
  }
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

type PredictResultModel = ReturnType<typeof predictResultFormat>

const predictResultFormat = (results: Array<GoogleMapPlaceModel>) =>
  results.map((result) => ({
    full: result.description,
    short: result.structured_formatting.main_text,
    id: result.place_id,
  }))

export const fetchPredictResultByWord = createAsyncThunk<
  PredictResultModel,
  string,
  { state: { google: { googleAutocompleteService: any } } }
>('users/fetchPredictResultByWord', async (word: string, { getState }) => {
  const { googleAutocompleteService: service } = getState().google
  // * TODO add option.bounds ( Map 4 corner )
  const option = {
    componentRestrictions: { country: 'tw' },
    input: word,
    type: 'establishment',
  }
  const response = await new Promise<Array<GoogleMapPlaceModel>>((resolve) => {
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
