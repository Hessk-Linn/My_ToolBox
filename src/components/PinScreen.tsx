import { useState, useEffect } from "react";
import { authApi } from "@/lib/apiClient";
import { useUser } from "@/contexts/UserContext";

const BG    = "#0a0d14";
const CARD  = "rgba(255,255,255,0.05)";
const BORD  = "rgba(255,255,255,0.1)";

const AVATARS: Record<string, string> = {
  "Linn": "👩",
  "User 2": "👤",
  "User 3": "👤",
  "User 4": "👤",
};

function getAvatar(name: string) {
  return AVATARS[name] ?? "👤";
}

const COLORS = ["#818cf8", "#34d399", "#fb923c", "#f472b6"];

export default function PinScreen() {
  const { setUserName } = useUser();
  const [users, setUsers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    authApi.getUsers()
      .then(setUsers)
      .catch(() => setUsers(["Linn", "User 2", "User 3", "User 4"]))
      .finally(() => setFetching(false));
  }, []);

  function pressDigit(d: string) {
    if (pin.length >= 4) return;
    const next = pin + d;
    setPin(next);
    setError("");
    if (next.length === 4) verify(next);
  }

  function backspace() {
    setPin(p => p.slice(0, -1));
    setError("");
  }

  async function verify(p: string) {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await authApi.verifyPin(p);
      setUserName(res.name);
    } catch {
      setError("Wrong PIN — try again");
      setPin("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", background: BG, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "24px 20px", color: "white",
    }}>
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>☀️</div>
        <div style={{ fontSize: "1.4rem", fontWeight: 900, letterSpacing: "0.02em" }}>My Tools</div>
        <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", marginTop: 4 }}>
          Family sync · identify yourself
        </div>
      </div>

      {fetching ? (
        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.85rem", marginBottom: 32 }}>Loading…</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: "100%", maxWidth: 320, marginBottom: 28 }}>
          {users.map((name, i) => {
            const color = COLORS[i % COLORS.length];
            const isSelected = selected === name;
            return (
              <button
                key={name}
                onClick={() => { setSelected(name); setPin(""); setError(""); }}
                style={{
                  background: isSelected ? `${color}22` : CARD,
                  border: `2px solid ${isSelected ? color : BORD}`,
                  borderRadius: 16, padding: "18px 12px",
                  cursor: "pointer", transition: "0.15s",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                }}
              >
                <div style={{ fontSize: "1.8rem" }}>{getAvatar(name)}</div>
                <div style={{ fontSize: "0.85rem", fontWeight: 800, color: isSelected ? color : "rgba(255,255,255,0.7)" }}>
                  {name}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {selected && (
        <div style={{ width: "100%", maxWidth: 320 }}>
          <div style={{ textAlign: "center", marginBottom: 16, fontSize: "0.82rem", color: "rgba(255,255,255,0.45)" }}>
            Enter PIN for <span style={{ color: "white", fontWeight: 700 }}>{selected}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 14, marginBottom: 20 }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{
                width: 14, height: 14, borderRadius: "50%",
                background: i < pin.length ? "white" : "rgba(255,255,255,0.15)",
                border: "2px solid rgba(255,255,255,0.25)",
                transition: "background 0.15s",
              }} />
            ))}
          </div>

          {error && (
            <div style={{
              background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)",
              borderRadius: 10, padding: "8px 14px", marginBottom: 14,
              fontSize: "0.8rem", color: "#fca5a5", textAlign: "center",
            }}>
              {error}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((d, i) => (
              <button
                key={i}
                onClick={() => d === "⌫" ? backspace() : d ? pressDigit(d) : undefined}
                disabled={loading || d === ""}
                style={{
                  height: 58, borderRadius: 12, fontSize: d === "⌫" ? "1.1rem" : "1.3rem", fontWeight: 700,
                  cursor: d ? "pointer" : "default",
                  background: d ? CARD : "transparent",
                  border: d ? `1px solid ${BORD}` : "none",
                  color: "white", transition: "0.1s",
                  opacity: (loading || d === "") ? 0.4 : 1,
                }}
              >
                {loading && pin.length === 4 && d === "⌫" ? "…" : d}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
