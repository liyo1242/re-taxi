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
  googlePredictResult: Array<GoogleMapPlaceModel>
}

const initialState: GoogleMapState = {
  googleGeocoderService: null,
  googleAutocompleteService: null,
  googlePredictResult: [],
}

export const fetchPredictResultByWord = createAsyncThunk<
  Array<GoogleMapPlaceModel>,
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
  const response = await new Promise((resolve) =>
    service.getPlacePredictions(option, (data) => resolve(data))
  )
  return response
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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPredictResultByWord.fulfilled, (state, action) => {
      state.googlePredictResult = action.payload
    })
  },
})

export const { setGoogleAutocompleteService, setGoogleGeocoderService } = googleSlice.actions

export default googleSlice.reducer
