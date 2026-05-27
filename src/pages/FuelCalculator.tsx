import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fuelApi, type FuelTrip, type FuelPrice } from "@/lib/apiClient";

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "14px 16px", fontSize: "1rem",
  border: "1px solid #ccc", borderRadius: "24px", fontFamily: "inherit",
  background: "#f9fafb", outline: "none", boxSizing: "border-box",
};
const labelStyle: React.CSSProperties = {
  display: "block", fontWeight: 600, marginBottom: 6, color: "#1e3a2f", fontSize: "0.95rem",
};
function focus(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor="#ff9800"; e.target.style.boxShadow="0 0 0 3px rgba(255,152,0,0.2)"; e.target.style.background="white";
}
function blur(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor="#ccc"; e.target.style.boxShadow="none"; e.target.style.background="#f9fafb";
}

export default function FuelCalculator() {
  const qc = useQueryClient();

  // ── Queries ──
  const { data: trips = [] } = useQuery({ queryKey:["fuel-trips"], queryFn: fuelApi.getTrips, refetchInterval:30_000 });
  const { data: prices = [] } = useQuery({ queryKey:["fuel-prices"], queryFn: fuelApi.getPrices, refetchInterval:30_000 });

  // ── Mutations ──
  const addTripM    = useMutation({ mutationFn: fuelApi.addTrip,    onSuccess:()=>qc.invalidateQueries({queryKey:["fuel-trips"]}) });
  const updTripM    = useMutation({ mutationFn: ({id,t}:{id:string,t:FuelTrip})=>fuelApi.updateTrip(id,t), onSuccess:()=>qc.invalidateQueries({queryKey:["fuel-trips"]}) });
  const delTripM    = useMutation({ mutationFn: fuelApi.deleteTrip,  onSuccess:()=>qc.invalidateQueries({queryKey:["fuel-trips"]}) });
  const addPriceM   = useMutation({ mutationFn: fuelApi.addPrice,    onSuccess:()=>qc.invalidateQueries({queryKey:["fuel-prices"]}) });
  const delPriceM   = useMutation({ mutationFn: fuelApi.deletePrice, onSuccess:()=>qc.invalidateQueries({queryKey:["fuel-prices"]}) });

  // Latest saved price
  const latestPrice = prices[0]?.priceMmk ?? null;

  // ── Trip form ──
  const [unit, setUnit]         = useState<"km"|"mile">("km");
  const [tripName, setTripName] = useState("");
  const [distance, setDistance] = useState("");
  const [efficiency, setEff]    = useState("");
  const [price, setPrice]       = useState(latestPrice ? String(latestPrice) : "");
  const [result, setResult]     = useState<{cost:number;liters:number;note:string}|null>(null);
  const [editId, setEditId]     = useState<string|null>(null);
  const [errors, setErrors]     = useState<string[]>([]);

  // ── Price form ──
  const [showPriceForm, setShowPriceForm] = useState(false);
  const [newPrice, setNewPrice]           = useState("");
  const [priceNote, setPriceNote]         = useState("");

  // Auto-fill price when latest changes
  const [priceTouched, setPriceTouched] = useState(false);

  const totalCost = trips.reduce((s,t)=>s+t.cost, 0);
  const isEditing = editId !== null;

  function validate() {
    const errs: string[] = [];
    if (!tripName.trim()) errs.push("Please enter a trip name.");
    if (!distance||isNaN(parseFloat(distance))||parseFloat(distance)<=0) errs.push("Enter a valid distance.");
    if (!efficiency||isNaN(parseFloat(efficiency))||parseFloat(efficiency)<=0) errs.push("Enter a valid fuel efficiency.");
    if (!price||isNaN(parseFloat(price))||parseFloat(price)<=0) errs.push("Enter a valid price per liter (MMK).");
    return errs;
  }

  async function handleCalculate() {
    const errs=validate();
    if (errs.length){ setErrors(errs); return; }
    setErrors([]);
    const d=parseFloat(distance), e=parseFloat(efficiency), p=parseFloat(price);
    const liters=d/e, cost=liters*p;
    const conversionNote=unit==="mile" ? `📐 ${d} miles ≈ ${(d*1.60934).toFixed(1)} km` : `📐 ${d} km ≈ ${(d/1.60934).toFixed(1)} miles`;
    setResult({cost,liters,note:conversionNote});
    const trip: FuelTrip = { id:editId??Date.now().toString(), name:tripName.trim(), distance:d, unit, efficiency:e, pricePerLiter:p, cost, liters, timestamp:Date.now() };
    if (editId) {
      await updTripM.mutateAsync({id:editId, t:trip});
      setEditId(null);
    } else {
      await addTripM.mutateAsync(trip);
    }
    setTripName(""); setDistance(""); setEff(""); setPrice(latestPrice?String(latestPrice):"");
  }

  function startEdit(t: FuelTrip) {
    setEditId(t.id); setTripName(t.name); setDistance(String(t.distance));
    setUnit(t.unit); setEff(String(t.efficiency)); setPrice(String(t.pricePerLiter));
    setResult(null); setErrors([]); window.scrollTo({top:0,behavior:"smooth"});
  }

  function cancelEdit() {
    setEditId(null); setTripName(""); setDistance(""); setEff("");
    setPrice(latestPrice?String(latestPrice):""); setResult(null); setErrors([]);
  }

  async function savePrice() {
    const p=parseFloat(newPrice);
    if (isNaN(p)||p<=0) return;
    await addPriceM.mutateAsync({ id:Date.now().toString(), priceMmk:p, note:priceNote.trim()||undefined });
    setNewPrice(""); setPriceNote(""); setShowPriceForm(false);
    if (!priceTouched) setPrice(String(p));
  }

  return (
    <div>
      <h2 style={{ fontSize:"1.8rem", margin:"0 0 8px 0", color:"#1a472a", display:"flex", alignItems:"center", gap:8 }}>
        ⛽ Fuel Cost <span style={{ color:"#ff9800" }}>MMK</span>
      </h2>
      <div style={{ color:"#555", borderLeft:"3px solid #ff9800", paddingLeft:12, marginBottom:20, fontSize:"0.9rem" }}>
        Auto-synced fuel tracking
      </div>

      {/* ── Fuel Price Memory ── */}
      <div style={{ background:"#fffbf0", border:"1px solid #fde68a", borderRadius:20, padding:"14px 16px", marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:showPriceForm?12:0 }}>
          <div>
            <div style={{ fontWeight:800, fontSize:"0.95rem", color:"#92400e" }}>
              ⛽ Current Fuel Price
            </div>
            {latestPrice ? (
              <div style={{ fontSize:"1.5rem", fontWeight:900, color:"#b45309", marginTop:2 }}>
                {latestPrice.toLocaleString()} <span style={{ fontSize:"0.85rem", fontWeight:600 }}>MMK/L</span>
              </div>
            ) : (
              <div style={{ fontSize:"0.8rem", color:"#a16207", marginTop:2 }}>No price recorded yet</div>
            )}
          </div>
          <button
            onClick={()=>setShowPriceForm(v=>!v)}
            style={{ background:"#ff9800", color:"white", border:"none", borderRadius:20, padding:"8px 14px", fontWeight:700, fontSize:"0.82rem", cursor:"pointer" }}
          >
            {showPriceForm ? "Cancel" : "+ New Price"}
          </button>
        </div>

        {showPriceForm && (
          <div>
            <div style={{ marginBottom:10 }}>
              <label style={{ ...labelStyle, fontSize:"0.85rem" }}>Price per liter (MMK)</label>
              <input type="number" placeholder="e.g. 2200" value={newPrice} onChange={e=>setNewPrice(e.target.value)}
                style={inputStyle} onFocus={focus} onBlur={blur} />
            </div>
            <div style={{ marginBottom:10 }}>
              <label style={{ ...labelStyle, fontSize:"0.85rem" }}>Note (optional)</label>
              <input type="text" placeholder="e.g. Station A, Jan 2026" value={priceNote} onChange={e=>setPriceNote(e.target.value)}
                style={inputStyle} onFocus={focus} onBlur={blur} />
            </div>
            <button onClick={savePrice} disabled={addPriceM.isPending} style={{ background:"#ff9800", color:"white", border:"none", borderRadius:20, padding:"10px 20px", fontWeight:700, width:"100%", cursor:"pointer" }}>
              {addPriceM.isPending?"Saving…":"Save Price"}
            </button>
          </div>
        )}

        {/* Price history mini-list */}
        {prices.length > 0 && !showPriceForm && (
          <div style={{ marginTop:10, maxHeight:120, overflowY:"auto" }}>
            {prices.map((p,i) => (
              <div key={p.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"5px 0", borderTop:i>0?"1px solid #fde68a88":"none" }}>
                <div>
                  <span style={{ fontWeight:700, fontSize:"0.85rem", color:"#92400e" }}>{p.priceMmk.toLocaleString()} MMK/L</span>
                  {p.note && <span style={{ fontSize:"0.72rem", color:"#a16207", marginLeft:8 }}>{p.note}</span>}
                </div>
                <button onClick={()=>delPriceM.mutate(p.id)} style={{ background:"none", border:"none", color:"#ef4444", cursor:"pointer", fontSize:"0.8rem", opacity:0.6 }}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Trip Calculator ── */}
      <div style={{ background:"white", borderRadius:24, padding:"20px 18px", boxShadow:"0 4px 16px rgba(0,0,0,0.08)", marginBottom:16, border:"1px solid #e5e7eb" }}>
        {isEditing && (
          <div style={{ marginBottom:16, padding:"10px 14px", borderRadius:16, border:"2px solid #ff9800", background:"#fff3e0", color:"#b45309", fontSize:"0.85rem", fontWeight:600, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
            <span>✏️ Editing: "{trips.find(t=>t.id===editId)?.name}"</span>
            <button onClick={cancelEdit} style={{ background:"#e0e0e0", color:"#333", border:"none", padding:"4px 12px", borderRadius:20, fontSize:"0.75rem", fontWeight:"bold", cursor:"pointer" }}>Cancel</button>
          </div>
        )}

        <div style={{ marginBottom:18 }}>
          <label style={labelStyle}>📌 Trip name</label>
          <input type="text" placeholder="e.g., Yangon → Mandalay" value={tripName} onChange={e=>{setTripName(e.target.value);setErrors([]);}} style={inputStyle} onFocus={focus} onBlur={blur} />
        </div>

        <div style={{ marginBottom:18 }}>
          <label style={labelStyle}>📏 Distance unit</label>
          <div style={{ display:"flex", gap:12 }}>
            {(["km","mile"] as const).map(u=>(
              <button key={u} onClick={()=>setUnit(u)} style={{ flex:1, background:unit===u?"#ff9800":"#e0e0e0", color:unit===u?"white":"#333", border:"none", padding:"10px", borderRadius:30, cursor:"pointer", fontWeight:600, fontSize:"0.9rem", transition:"0.2s" }}>
                {u==="km"?"Kilometers (km)":"Miles (mi)"}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom:18 }}>
          <label style={labelStyle}>📏 Distance ({unit==="km"?"km":"miles"})</label>
          <input type="number" step="any" placeholder={unit==="km"?"e.g., 250":"e.g., 150"} value={distance} onChange={e=>{setDistance(e.target.value);setErrors([]);}} style={inputStyle} onFocus={focus} onBlur={blur} />
        </div>

        <div style={{ marginBottom:18 }}>
          <label style={labelStyle}>⚡ Fuel efficiency ({unit==="km"?"km":"miles"}/L)</label>
          <input type="number" step="any" placeholder="e.g., 15" value={efficiency} onChange={e=>{setEff(e.target.value);setErrors([]);}} style={inputStyle} onFocus={focus} onBlur={blur} />
        </div>

        <div style={{ marginBottom:18 }}>
          <label style={labelStyle}>
            💰 Price per liter (MMK)
            {latestPrice && <span style={{ fontSize:"0.75rem", fontWeight:500, color:"#6b7280", marginLeft:8 }}>— saved: {latestPrice.toLocaleString()}</span>}
          </label>
          <input type="number" placeholder="e.g., 2200" value={price} onChange={e=>{setPrice(e.target.value);setPriceTouched(true);setErrors([]);}} style={inputStyle} onFocus={focus} onBlur={blur} />
        </div>

        {errors.length>0 && <ul style={{ color:"#dc2626", fontSize:"0.85rem", marginBottom:10, paddingLeft:0, listStyle:"none" }}>{errors.map((e,i)=><li key={i}>• {e}</li>)}</ul>}

        <button onClick={handleCalculate} disabled={addTripM.isPending||updTripM.isPending} style={{ background:isEditing?"#2196F3":"#ff9800", color:"white", border:"none", padding:"14px 20px", fontSize:"1.1rem", fontWeight:"bold", borderRadius:40, width:"100%", cursor:"pointer", marginTop:4, transition:"0.2s" }}>
          {addTripM.isPending||updTripM.isPending?"Saving…":isEditing?"✏️ Update Trip":"🚗 Calculate Trip"}
        </button>
      </div>

      {result && (
        <div style={{ background:"#eef5ea", padding:20, borderRadius:24, marginBottom:16, textAlign:"center" }}>
          <div style={{ color:"#555" }}>💸 Estimated Fuel Cost</div>
          <div style={{ fontSize:"2.2rem", fontWeight:800, color:"#1a472a", margin:"8px 0" }}>{Math.round(result.cost).toLocaleString()} MMK</div>
          <div style={{ color:"#1a472a", fontWeight:500 }}>⛽ {result.liters.toFixed(1)} liters needed</div>
          <div style={{ fontSize:"0.7rem", color:"#666", marginTop:6 }}>{result.note}</div>
        </div>
      )}

      <div style={{ background:"#f4f0e6", borderRadius:24, padding:"12px 16px", marginTop:8 }}>
        <h3 style={{ margin:"8px 0 12px", fontSize:"1.2rem", display:"flex", alignItems:"center", gap:6, color:"#1a472a" }}>📋 Recent trips</h3>
        <div style={{ background:"#1a472a", color:"white", padding:10, borderRadius:20, textAlign:"center", marginBottom:15, fontWeight:"bold" }}>
          💰 Total: {Math.round(totalCost).toLocaleString()} MMK
        </div>
        {trips.length===0 ? (
          <li style={{ color:"#aaa", listStyle:"none", padding:"8px 0" }}>✨ No trips yet. Add one!</li>
        ) : (
          <ul style={{ listStyle:"none", padding:0, margin:0, maxHeight:300, overflowY:"auto" }}>
            {trips.map(trip=>(
              <li key={trip.id} style={{ padding:"10px 0", borderBottom:"1px solid #ddd", fontSize:"0.85rem", display:"flex", justifyContent:"space-between", alignItems:"center", gap:8, flexWrap:"wrap", ...(editId===trip.id?{background:"#fff3e0",borderLeft:"4px solid #ff9800",paddingLeft:8}:{}) }}>
                <div style={{ flex:2, minWidth:120 }}>
                  <strong>{trip.name}</strong><br />
                  {trip.distance} {trip.unit} | {Math.round(trip.cost).toLocaleString()} MMK
                </div>
                <div style={{ display:"flex", gap:8, flexShrink:0 }}>
                  <button onClick={()=>startEdit(trip)} style={{ background:"#2196F3", color:"white", border:"none", padding:"6px 12px", borderRadius:20, fontSize:"0.75rem", fontWeight:"bold", cursor:"pointer" }}>✏️ Edit</button>
                  <button onClick={()=>{ if(!window.confirm(`Delete "${trip.name}"?`))return; delTripM.mutate(trip.id); if(editId===trip.id)cancelEdit(); }} style={{ background:"#f44336", color:"white", border:"none", padding:"6px 12px", borderRadius:20, fontSize:"0.75rem", fontWeight:"bold", cursor:"pointer" }}>🗑</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p style={{ fontSize:"0.7rem", textAlign:"center", color:"#888", marginTop:20 }}>
        ☁️ Auto-synced · data saved to database
      </p>
    </div>
  );
}
