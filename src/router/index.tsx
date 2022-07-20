import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../layout";
import Form from "../feature/form";
import Status from "../feature/status";
import History from "../feature/history";

export default function RouterView() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="form" element={<Form />} />
        <Route path="history" element={<History />} />
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There is nothing here!</p>
            </main>
          }
        />
      </Route>
      <Route path="/status" element={<Status />} />
    </Routes>
  );
}
