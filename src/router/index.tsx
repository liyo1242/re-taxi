import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../layout'
import Form from '../feature/form'
import Status from '../feature/status'

export default function RouterView() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/form" replace />} />
        <Route path="form" element={<Form />} />
        <Route
          path="*"
          element={
            <main style={{ padding: '1rem' }}>
              <p>There is nothing here!</p>
            </main>
          }
        />
      </Route>
      <Route path="/status" element={<Status />} />
    </Routes>
  )
}
