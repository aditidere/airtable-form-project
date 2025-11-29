import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import FormBuilderPage from "./pages/FormBuilderPage";
import FormResponsePage from "./pages/FormResponsePage";
import FormSubmitPage from "./pages/FormSubmitPage";

export default function App() {
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  return (
    <Routes>
      <Route
        path="/"
        element={
          !userId ? (
            <LoginPage onLogin={(id) => setUserId(id)} />
          ) : (
            <div style={{ padding: "2rem" }}>
              <h1>Welcome!</h1>
              <p>Logged in as userId: {userId}</p>

              <button onClick={() => (window.location.href = "/builder")}>
                Go to Form Builder
              </button>

              <br /><br />
              <button
                style={{ background: "red", color: "white", padding: "10px" }}
                onClick={() => {
                  localStorage.removeItem("userId");
                  window.location.href = "/";
                }}
              >
                Logout
              </button>
            </div>
          )
        }
      />

      <Route path="/builder" element={<FormBuilderPage />} />
      <Route path="/submit/:formId" element={<FormSubmitPage />} />

      <Route path="/form/:id" element={<FormResponsePage />} />
    </Routes>
  );
}
