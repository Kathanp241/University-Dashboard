import { useState } from "react";
import axios from "axios";
import html2canvas from "html2canvas";

function App() {
  const [country, setCountry] = useState("");
  const [universities, setUniversities] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchByCountry = async () => {
    if (!country.trim()) return;
    try {
      setLoading(true);
      setError("");

      // 👉 CALL YOUR BACKEND
      const res = await axios.get(
        `http://localhost:5500/universities?country=${country}`
      );

      setUniversities(res.data);

      const uniqueStates = [
        ...new Set(res.data.map((u) => u.stateProvince).filter(Boolean)),
      ];
      setStates(uniqueStates);
      setSelectedState("");
    } catch (err) {
      console.error(err);
      setError("Failed to load universities");
    } finally {
      setLoading(false);
    }
  };

  const filteredUniversities = selectedState
    ? universities.filter((u) => u.stateProvince === selectedState)
    : universities;

  const downloadCard = (id) => {
    const card = document.getElementById(id);
    if (!card) return;

    html2canvas(card).then((canvas) => {
      const link = document.createElement("a");
      link.download = "university.jpg";
      link.href = canvas.toDataURL("image/jpeg");
      link.click();
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      {/* TOP BAR */}
      <header
        style={{
          padding: "16px 24px",
          background: "#111827",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>Dashboard Overview</h2>
        <span style={{ opacity: 0.7 }}>University Search</span>
      </header>

      {/* MAIN CONTENT */}
      <main style={{ padding: "20px 24px" }}>
        {/* SEARCH PANEL */}
        <section
          style={{
            background: "white",
            padding: 16,
            borderRadius: 12,
            marginBottom: 20,
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: 12 }}>Search Filters</h3>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              placeholder="Enter country (e.g. India, United States)"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              style={{
                padding: 8,
                borderRadius: 8,
                border: "1px solid #d1d5db",
                minWidth: 220,
              }}
            />

            <button
              onClick={searchByCountry}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "none",
                background: "#2563eb",
                color: "white",
                cursor: "pointer",
              }}
            >
              {loading ? "Loading..." : "Search"}
            </button>

            {states.length > 0 && (
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                style={{
                  padding: 8,
                  borderRadius: 8,
                  border: "1px solid #d1d5db",
                  minWidth: 200,
                }}
              >
                <option value="">All States / Provinces</option>
                {states.map((state, i) => (
                  <option key={i} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            )}
          </div>

          {error && (
            <p style={{ color: "red", marginTop: 10 }}>
              {error}
            </p>
          )}
        </section>

        {/* DASHBOARD STATS */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 12,
              padding: 14,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>
              Total Universities
            </p>
            <h2 style={{ margin: "6px 0" }}>{universities.length}</h2>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: 12,
              padding: 14,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>
              Unique States/Provinces
            </p>
            <h2 style={{ margin: "6px 0" }}>{states.length}</h2>
          </div>
        </section>

        {/* UNIVERSITY CARDS GRID (THIS IS YOUR "DASHBOARD") */}
        <section>
          <h3 style={{ marginBottom: 12 }}>Universities</h3>

          {filteredUniversities.length === 0 && !loading && (
            <p style={{ color: "#6b7280" }}>
              No universities to show. Try searching a country above.
            </p>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {filteredUniversities.map((uni, index) => (
              <div
                key={index}
                id={`card-${index}`}
                style={{
                  background: "white",
                  borderRadius: 12,
                  padding: 16,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h4 style={{ margin: "0 0 6px" }}>{uni.name}</h4>
                  <p
                    style={{
                      margin: "0 0 4px",
                      fontSize: 13,
                      color: "#6b7280",
                    }}
                  >
                    {uni.country}{" "}
                    {uni.stateProvince ? `• ${uni.stateProvince}` : ""}
                  </p>
                  {uni.webPages && uni.webPages[0] && (
                    <a
                      href={uni.webPages[0]}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: 13 }}
                    >
                      Visit Website
                    </a>
                  )}
                </div>

                <button
                  onClick={() => downloadCard(`card-${index}`)}
                  style={{
                    marginTop: 12,
                    padding: "6px 10px",
                    borderRadius: 8,
                    border: "1px solid #d1d5db",
                    background: "#f9fafb",
                    fontSize: 12,
                    cursor: "pointer",
                    alignSelf: "flex-start",
                  }}
                >
                  Download as JPEG
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default dashboard;
