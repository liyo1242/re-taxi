import { store } from '.'
import type { TypedStartListening } from '@reduxjs/toolkit'

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export type StartListening = TypedStartListening<RootState, AppDispatch>
