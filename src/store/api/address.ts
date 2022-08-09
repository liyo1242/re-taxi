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

export interface PostTaxiOrder {
  name: string
  phone: string
  origin: {
    address: string
    lat: number
    lon: number
    id?: string
  }
  destination?: {
    address: string
    lat: number
    lon: number
    id?: string
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
    postTaxiOrder: builder.mutation<string, PostTaxiOrder>({
      query: (body) => ({
        url: `order`,
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const { useGetFavoriteAddressQuery, useGetHistoryAddressQuery, usePostTaxiOrderMutation } =
  addressApi
