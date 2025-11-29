import { useState } from "react";

export default function LoginPage({ onLogin }) {
  const [name, setName] = useState("");
  const [token, setToken] = useState("");

  const handleLogin = async () => {
    if (!name || !token) {
      alert("Enter name and token");
      return;
    }

    const res = await fetch("http://localhost:5000/api/auth/mock-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        airtableUserId: "dummy-user-123",   // REQUIRED
        name,
        email: `${name}@gmail.com`,
        accessToken: token,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("userId", data.userId);
      onLogin(data.userId);
    } else {
      alert(data.message || "Login failed");
      console.log("Login error:", data);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Login</h2>

      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ display: "block", marginBottom: "10px" }}
      />

      <input
        type="text"
        placeholder="Airtable token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        style={{ display: "block", marginBottom: "10px" }}
      />

      <button type="button" onClick={handleLogin}>Login</button>
    </div>
  );
}
