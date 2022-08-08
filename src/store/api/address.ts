import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TransUnCapitalize, ToUnCapitalize } from '../../utils'

interface FavoriteApiModel {
  Id: string
  Address: string
  Geo: {
    Lat: number
    lng: number
  }
}

export const addressApi = createApi({
  reducerPath: 'addressApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
  endpoints: (builder) => ({
    getFavoriteAddress: builder.query<Array<TransUnCapitalize<FavoriteApiModel>>, number>({
      query: (_limit) => `favorite?_start=0&_limit=${_limit}`,
      transformResponse: (rawResult: Array<FavoriteApiModel>) => ToUnCapitalize(rawResult),
    }),
    getHistoryAddress: builder.query<Array<TransUnCapitalize<FavoriteApiModel>>, number>({
      query: (_limit) => `history?_start=0&_limit=${_limit}`,
      transformResponse: (rawResult: Array<FavoriteApiModel>) => ToUnCapitalize(rawResult),
    }),
  }),
})

export const { useGetFavoriteAddressQuery, useGetHistoryAddressQuery } = addressApi
