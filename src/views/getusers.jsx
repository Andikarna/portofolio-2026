import { useState } from "react";
import { getUser } from "../api/api.js";

export default function GetUserView() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState("");

  const handleGetUser = async () => {
    if (!token) {
      setResult("Token belum diisi!");
      return;
    }

    try {
      const res = await getUser(token);
      setResult(JSON.stringify(res.data, null, 2));
    } catch (err) {
      setResult("Gagal ambil user: " + err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Get User</h2>
      <input
        type="text"
        placeholder="Masukkan token JWT"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        style={{ width: "400px" }}
      />
      <br /><br />
      <button onClick={handleGetUser}>Ambil User</button>

      <pre style={{ marginTop: 20, background: "#f4f4f4", padding: 10 }}>
        {result}
      </pre>
    </div>
  );
}
