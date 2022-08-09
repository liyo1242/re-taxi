import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './type'

import addressReducer from './address'
import layoutReducer from './layout'
import googleReducer from './google'

import { addressApi } from './api/address'

// * setup middleware
export const listenerMiddleware = createListenerMiddleware()

export const store = configureStore({
  reducer: {
    address: addressReducer,
    layout: layoutReducer,
    google: googleReducer,
    [addressApi.reducerPath]: addressApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .prepend(listenerMiddleware.middleware)
      .concat(addressApi.middleware),
})

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
