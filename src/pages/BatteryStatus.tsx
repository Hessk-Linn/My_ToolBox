import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { batteryApi, type BatteryReading } from "@/lib/apiClient";

const VOLTAGE_CURVE = [
  { v: 29.2, pct: 100 }, { v: 28.4, pct: 90 }, { v: 27.6, pct: 75 },
  { v: 26.8, pct: 55 },  { v: 26.0, pct: 35 }, { v: 25.0, pct: 20 },
  { v: 23.6, pct: 10 },  { v: 22.0, pct: 5 },  { v: 20.0, pct: 0 },
];
function voltageToPercent(v: number): number {
  if (v >= VOLTAGE_CURVE[0].v) return 100;
  if (v <= VOLTAGE_CURVE[VOLTAGE_CURVE.length - 1].v) return 0;
  for (let i = 0; i < VOLTAGE_CURVE.length - 1; i++) {
    const hi = VOLTAGE_CURVE[i], lo = VOLTAGE_CURVE[i + 1];
    if (v <= hi.v && v >= lo.v) {
      const t = (v - lo.v) / (hi.v - lo.v);
      return Math.round(lo.pct + t * (hi.pct - lo.pct));
    }
  }
  return 0;
}
type AlertLevel = "critical" | "warning" | "low" | "good" | "full";
function getAlert(v: number, pct: number): AlertLevel {
  if (v <= 22.0 || pct <= 5)  return "critical";
  if (v <= 24.0 || pct <= 20) return "warning";
  if (pct <= 35)               return "low";
  if (pct >= 90)               return "full";
  return "good";
}
function alertColor(a: AlertLevel): string {
  if (a === "critical") return "#ef4444";
  if (a === "warning")  return "#f97316";
  if (a === "low")      return "#fbbf24";
  if (a === "full")     return "#22c55e";
  return "#4ade80";
}
function alertLabel(a: AlertLevel): string {
  if (a === "critical") return "CRITICAL — Charge Now!";
  if (a === "warning")  return "LOW — Charge Soon";
  if (a === "low")      return "Fair — Monitor";
  if (a === "full")     return "Full Charge";
  return "Good";
}

function BatterySVG({ pct, color }: { pct: number; color: string }) {
  const H = 170, W = 90, X = 15, Y = 22;
  const fillH = Math.max(0, (pct / 100) * H);
  const fillY = Y + H - fillH;
  return (
    <svg width="120" height="220" viewBox="0 0 120 220" fill="none">
      <rect x="42" y="2" width="36" height="14" rx="7" fill="rgba(255,255,255,0.25)" />
      <rect x={X} y={Y} width={W} height={H} rx="10" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
      <clipPath id="clip24"><rect x={X+2} y={Y+2} width={W-4} height={H-4} rx="8" /></clipPath>
      <rect x={X+2} y={fillY} width={W-4} height={fillH} fill={color} opacity="0.85" clipPath="url(#clip24)" style={{ transition:"height 0.7s ease, y 0.7s ease" }} />
      {[0.25,0.5,0.75].map((f,i) => <line key={i} x1={X+2} y1={Y+H*f} x2={X+W-2} y2={Y+H*f} stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />)}
      <text x="60" y={Y+H/2+4} textAnchor="middle" dominantBaseline="central" fontSize="26" fontWeight="900" fill={pct>50?"white":color} style={{transition:"fill 0.4s"}}>{pct}%</text>
    </svg>
  );
}

const BG = "#0f1117", CARD = "rgba(255,255,255,0.04)", BORDER = "rgba(255,255,255,0.09)";
const inp: React.CSSProperties = {
  width:"100%", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)",
  borderRadius:12, padding:"12px 40px 12px 14px", color:"white", fontSize:"1.15rem",
  fontFamily:"inherit", outline:"none", boxSizing:"border-box", fontWeight:700,
};

export default function BatteryStatus() {
  const qc = useQueryClient();
  const { data: readings = [], isLoading } = useQuery({
    queryKey: ["battery-readings"],
    queryFn: batteryApi.getReadings,
    refetchInterval: 30_000,
  });

  const addMutation = useMutation({
    mutationFn: batteryApi.addReading,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["battery-readings"] }),
  });
  const delMutation = useMutation({
    mutationFn: batteryApi.deleteReading,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["battery-readings"] }),
  });

  const [voltInput, setVoltInput] = useState("");
  const [live, setLive] = useState<{ v: number; pct: number; alert: AlertLevel } | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const v = parseFloat(voltInput);
    if (!isNaN(v) && v >= 18 && v <= 32) {
      const pct = voltageToPercent(v);
      setLive({ v, pct, alert: getAlert(v, pct) });
    } else {
      setLive(null);
    }
    setSaved(false);
  }, [voltInput]);

  const lastReading = readings[0] ?? null;
  const display = live ?? (lastReading ? { v: lastReading.voltage, pct: lastReading.pct, alert: lastReading.alert as AlertLevel } : null);
  const color = display ? alertColor(display.alert) : "#22c55e";

  async function saveReading() {
    if (!live || addMutation.isPending) return;
    const r: BatteryReading = {
      id: Date.now().toString(), voltage: live.v, pct: live.pct,
      alert: live.alert, ts: new Date().toLocaleString(),
    };
    await addMutation.mutateAsync(r);
    setSaved(true);
    setVoltInput("");
    setLive(null);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div style={{ margin:"0", background:BG, minHeight:"100vh", padding:"12px", color:"white" }} className="sm:p-4 md:p-6">

      <div className="mb-3 sm:mb-4">
        <div style={{ fontWeight:900 }} className="text-base sm:text-lg md:text-xl">⚡ 24V Solar Monitor</div>
        <div style={{ color:"rgba(255,255,255,0.35)", marginTop:2 }} className="text-xs sm:text-sm">
          8S LiFePO4 · 20.0V – 29.2V range
          {isLoading && <span style={{ marginLeft:8, opacity:0.5 }}>syncing…</span>}
        </div>
      </div>

      {display && (
        <div style={{ background:CARD, border:`1px solid ${display.alert!=="good"&&display.alert!=="full"?color+"55":BORDER}`, borderRadius:18, marginBottom:12, display:"flex", alignItems:"center" }} className="p-3 sm:p-4 md:p-5 gap-3 sm:gap-4 md:gap-5 flex-col sm:flex-row">
          <div style={{ flexShrink:0 }}><BatterySVG pct={display.pct} color={color} /></div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:"3rem", fontWeight:900, color, lineHeight:1 }}>{display.pct}%</div>
            <div style={{ fontSize:"1.4rem", fontWeight:700, color:"rgba(255,255,255,0.6)", marginTop:4 }}>{display.v.toFixed(1)} V</div>
            <div style={{ marginTop:10, display:"inline-block", padding:"5px 12px", borderRadius:99, fontSize:"0.75rem", fontWeight:800, background:color+"18", color, border:`1px solid ${color}44` }}>
              {alertLabel(display.alert)}
            </div>
            <div style={{ marginTop:14, display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
              {[{label:"System",value:"24V 8S"},{label:"Chemistry",value:"LiFePO4"},{label:"Full",value:"29.2 V"},{label:"Empty",value:"20.0 V"}].map(({label,value})=>(
                <div key={label} style={{ background:"rgba(255,255,255,0.05)", borderRadius:8, padding:"6px 10px" }}>
                  <div style={{ fontSize:"0.6rem", color:"rgba(255,255,255,0.35)", fontWeight:700, letterSpacing:"0.05em", textTransform:"uppercase" }}>{label}</div>
                  <div style={{ fontSize:"0.82rem", fontWeight:800, color:"rgba(255,255,255,0.8)", marginTop:1 }}>{value}</div>
                </div>
              ))}
            </div>
            {lastReading && !live && (
              <div style={{ marginTop:8, fontSize:"0.65rem", color:"rgba(255,255,255,0.25)" }}>
                Last: {lastReading.ts}
              </div>
            )}
          </div>
        </div>
      )}

      {display && (display.alert==="critical"||display.alert==="warning") && (
        <div style={{ background:display.alert==="critical"?"#451a1a":"#422006", border:`1px solid ${color}55`, borderRadius:12, padding:"10px 14px", marginBottom:12, fontSize:"0.82rem", fontWeight:800, color }}>
          {display.alert==="critical" ? "🔴 Battery critically low — connect charger immediately to avoid damage!" : "🟠 Battery getting low — plan to charge soon."}
        </div>
      )}

      <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:14, padding:"12px 14px", marginBottom:12 }}>
        <div style={{ fontSize:"0.72rem", fontWeight:700, color:"rgba(255,255,255,0.35)", marginBottom:8, letterSpacing:"0.05em", textTransform:"uppercase" }}>Voltage Reference (8S LiFePO4)</div>
        <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
          {VOLTAGE_CURVE.slice(0,-1).map(({v,pct})=>{
            const a=getAlert(v,pct); const c=alertColor(a);
            const isActive=display&&Math.abs(display.v-v)<0.5;
            return (
              <div key={v} style={{ flex:1, minWidth:44, textAlign:"center", padding:"5px 4px", borderRadius:8, border:`1px solid ${isActive?c:"rgba(255,255,255,0.06)"}`, background:isActive?c+"18":"transparent" }}>
                <div style={{ fontSize:"0.7rem", fontWeight:800, color:isActive?c:"rgba(255,255,255,0.6)" }}>{v}V</div>
                <div style={{ fontSize:"0.6rem", color:isActive?c:"rgba(255,255,255,0.28)" }}>{pct}%</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:14, padding:"14px", marginBottom:12 }}>
        <div style={{ fontSize:"0.72rem", fontWeight:700, color:"rgba(255,255,255,0.4)", marginBottom:8, letterSpacing:"0.05em", textTransform:"uppercase" }}>Enter Voltage Reading</div>
        <div style={{ position:"relative" }}>
          <input type="number" step="0.1" min="18" max="32" placeholder="e.g. 26.4" value={voltInput} onChange={e=>setVoltInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveReading()} style={inp} autoComplete="off" />
          <span style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.4)", fontWeight:700, fontSize:"0.9rem", pointerEvents:"none" }}>V</span>
        </div>
        {live && (
          <button onClick={saveReading} disabled={saved||addMutation.isPending} style={{ marginTop:10, width:"100%", padding:"11px", borderRadius:10, fontWeight:900, fontSize:"0.9rem", cursor:(saved||addMutation.isPending)?"not-allowed":"pointer", border:"none", background:saved?"rgba(255,255,255,0.08)":"rgba(34,197,94,0.2)", color:saved?"rgba(255,255,255,0.4)":"#22c55e", transition:"0.15s" }}>
            {addMutation.isPending ? "Saving…" : saved ? "Saved ✓" : "Save Reading"}
          </button>
        )}
        {!live && <div style={{ marginTop:8, fontSize:"0.7rem", color:"rgba(255,255,255,0.3)" }}>Type a voltage to see instant reading — {readings.length>0?"showing last saved reading above":"20V – 29.2V range"}</div>}
      </div>

      {readings.length > 0 && (
        <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:14, overflow:"hidden" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 14px", borderBottom:`1px solid ${BORDER}` }}>
            <div style={{ fontSize:"0.8rem", fontWeight:700, color:"rgba(255,255,255,0.5)" }}>Reading History ({readings.length})</div>
          </div>
          <div style={{ maxHeight:280, overflowY:"auto" }}>
            {readings.map(r=>{
              const c=alertColor(r.alert as AlertLevel);
              return (
                <div key={r.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderBottom:`1px solid ${BORDER}` }}>
                  <div style={{ width:4, height:36, borderRadius:99, background:c, flexShrink:0 }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontWeight:800, fontSize:"0.9rem", color:"white" }}>{r.voltage.toFixed(1)}V</span>
                      <span style={{ fontSize:"0.72rem", fontWeight:700, padding:"2px 8px", borderRadius:99, background:c+"18", color:c }}>{r.pct}%</span>
                    </div>
                    <div style={{ fontSize:"0.65rem", color:"rgba(255,255,255,0.28)", marginTop:2 }}>
                      {r.ts}
                    </div>
                  </div>
                  <button onClick={()=>delMutation.mutate(r.id)} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.2)", cursor:"pointer", fontSize:"0.85rem" }}>✕</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {readings.length===0&&!display&&!isLoading&&(
        <div style={{ textAlign:"center", padding:"40px 0", color:"rgba(255,255,255,0.2)", fontSize:"0.9rem" }}>🔋 Enter a voltage above to check your battery.</div>
      )}
    </div>
  );
}
