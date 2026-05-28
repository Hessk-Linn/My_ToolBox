import { useState } from 'react';
import { ArrowRightLeft, Zap, Gauge, DollarSign, Ruler } from 'lucide-react';

const CARD_STYLE = {
  background: 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%)',
  border: '1px solid #1a2332',
  borderRadius: '16px',
  padding: '20px',
  marginBottom: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
};

const INPUT_STYLE = {
  width: '100%',
  padding: '12px 16px',
  background: '#0a0e1a',
  border: '1px solid #1a2332',
  borderRadius: '10px',
  color: '#e0e0e0',
  fontSize: '1rem',
  fontWeight: 600,
  outline: 'none',
  transition: 'all 0.3s',
};

const LABEL_STYLE = {
  fontSize: '0.75rem',
  fontWeight: 700,
  color: '#6b7280',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  marginBottom: '8px',
};

const RESULT_STYLE = {
  padding: '16px',
  background: 'linear-gradient(135deg, rgba(0,255,136,0.1) 0%, rgba(0,204,106,0.05) 100%)',
  border: '1px solid rgba(0,255,136,0.2)',
  borderRadius: '12px',
  marginTop: '12px',
};

export default function Converter() {
  const [voltage, setVoltage] = useState('');
  const [current, setCurrent] = useState('');
  const [power, setPower] = useState('');
  
  const [ah, setAh] = useState('');
  const [volts, setVolts] = useState('');
  const [wh, setWh] = useState('');
  
  const [km, setKm] = useState('');
  const [miles, setMiles] = useState('');
  
  const [mmk, setMmk] = useState('');
  const [usd, setUsd] = useState('');
  const exchangeRate = 2100;

  const calculatePower = (v: string, a: string) => {
    const vNum = parseFloat(v);
    const aNum = parseFloat(a);
    if (!isNaN(vNum) && !isNaN(aNum)) {
      setPower((vNum * aNum).toFixed(2));
    } else {
      setPower('');
    }
  };

  const calculateEnergy = (ahVal: string, vVal: string) => {
    const ahNum = parseFloat(ahVal);
    const vNum = parseFloat(vVal);
    if (!isNaN(ahNum) && !isNaN(vNum)) {
      setWh((ahNum * vNum).toFixed(2));
    } else {
      setWh('');
    }
  };

  return (
    <div style={{ margin: 0, minHeight: '100vh', color: '#e0e0e0' }}>
      
      {/* Power Calculator */}
      <div style={CARD_STYLE}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ padding: '10px', background: 'rgba(0,255,136,0.1)', borderRadius: '10px' }}>
            <Zap size={24} color="#00ff88" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#00ff88', margin: 0 }}>Power Calculator</h2>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Watts = Volts × Amps</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <div style={LABEL_STYLE}>Voltage (V)</div>
            <input
              type="number"
              placeholder="e.g., 24"
              value={voltage}
              onChange={(e) => {
                setVoltage(e.target.value);
                calculatePower(e.target.value, current);
              }}
              style={INPUT_STYLE}
            />
          </div>
          <div>
            <div style={LABEL_STYLE}>Current (A)</div>
            <input
              type="number"
              placeholder="e.g., 10"
              value={current}
              onChange={(e) => {
                setCurrent(e.target.value);
                calculatePower(voltage, e.target.value);
              }}
              style={INPUT_STYLE}
            />
          </div>
        </div>

        {power && (
          <div style={RESULT_STYLE}>
            <div style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 700, marginBottom: '4px' }}>POWER OUTPUT</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#00ff88' }}>
              {power} <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>Watts</span>
            </div>
          </div>
        )}
      </div>

      {/* Energy Calculator */}
      <div style={CARD_STYLE}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ padding: '10px', background: 'rgba(0,255,136,0.1)', borderRadius: '10px' }}>
            <Gauge size={24} color="#00ff88" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#00ff88', margin: 0 }}>Energy Calculator</h2>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Wh = Ah × Volts</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <div style={LABEL_STYLE}>Capacity (Ah)</div>
            <input
              type="number"
              placeholder="e.g., 100"
              value={ah}
              onChange={(e) => {
                setAh(e.target.value);
                calculateEnergy(e.target.value, volts);
              }}
              style={INPUT_STYLE}
            />
          </div>
          <div>
            <div style={LABEL_STYLE}>Voltage (V)</div>
            <input
              type="number"
              placeholder="e.g., 48"
              value={volts}
              onChange={(e) => {
                setVolts(e.target.value);
                calculateEnergy(ah, e.target.value);
              }}
              style={INPUT_STYLE}
            />
          </div>
        </div>

        {wh && (
          <div style={RESULT_STYLE}>
            <div style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 700, marginBottom: '4px' }}>ENERGY CAPACITY</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#00ff88' }}>
              {wh} <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>Wh</span>
              <span style={{ fontSize: '1rem', color: '#6b7280', marginLeft: '12px' }}>
                ({(parseFloat(wh) / 1000).toFixed(2)} kWh)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Distance Converter */}
      <div style={CARD_STYLE}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ padding: '10px', background: 'rgba(0,255,136,0.1)', borderRadius: '10px' }}>
            <Ruler size={24} color="#00ff88" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#00ff88', margin: 0 }}>Distance Converter</h2>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Kilometers ↔ Miles</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'end' }}>
          <div>
            <div style={LABEL_STYLE}>Kilometers</div>
            <input
              type="number"
              placeholder="100"
              value={km}
              onChange={(e) => {
                setKm(e.target.value);
                const val = parseFloat(e.target.value);
                setMiles(!isNaN(val) ? (val * 0.621371).toFixed(2) : '');
              }}
              style={INPUT_STYLE}
            />
          </div>
          <div style={{ paddingBottom: '12px' }}>
            <ArrowRightLeft size={20} color="#00ff88" />
          </div>
          <div>
            <div style={LABEL_STYLE}>Miles</div>
            <input
              type="number"
              placeholder="62.14"
              value={miles}
              onChange={(e) => {
                setMiles(e.target.value);
                const val = parseFloat(e.target.value);
                setKm(!isNaN(val) ? (val * 1.60934).toFixed(2) : '');
              }}
              style={INPUT_STYLE}
            />
          </div>
        </div>
      </div>

      {/* Currency Converter */}
      <div style={CARD_STYLE}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ padding: '10px', background: 'rgba(0,255,136,0.1)', borderRadius: '10px' }}>
            <DollarSign size={24} color="#00ff88" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#00ff88', margin: 0 }}>Currency Converter</h2>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>MMK ↔ USD (Rate: {exchangeRate})</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'end' }}>
          <div>
            <div style={LABEL_STYLE}>Myanmar Kyat (MMK)</div>
            <input
              type="number"
              placeholder="2100"
              value={mmk}
              onChange={(e) => {
                setMmk(e.target.value);
                const val = parseFloat(e.target.value);
                setUsd(!isNaN(val) ? (val / exchangeRate).toFixed(2) : '');
              }}
              style={INPUT_STYLE}
            />
          </div>
          <div style={{ paddingBottom: '12px' }}>
            <ArrowRightLeft size={20} color="#00ff88" />
          </div>
          <div>
            <div style={LABEL_STYLE}>US Dollar (USD)</div>
            <input
              type="number"
              placeholder="1.00"
              value={usd}
              onChange={(e) => {
                setUsd(e.target.value);
                const val = parseFloat(e.target.value);
                setMmk(!isNaN(val) ? (val * exchangeRate).toFixed(0) : '');
              }}
              style={INPUT_STYLE}
            />
          </div>
        </div>
      </div>

      {/* Quick Reference */}
      <div style={{ ...CARD_STYLE, background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.2)' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#00ff88', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          ⚡ Quick Reference
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '0.8rem', color: '#9ca3af' }}>
          <div><strong style={{ color: '#00ff88' }}>12V System:</strong> 12V × 100Ah = 1,200Wh (1.2kWh)</div>
          <div><strong style={{ color: '#00ff88' }}>24V System:</strong> 24V × 100Ah = 2,400Wh (2.4kWh)</div>
          <div><strong style={{ color: '#00ff88' }}>48V System:</strong> 48V × 100Ah = 4,800Wh (4.8kWh)</div>
          <div><strong style={{ color: '#00ff88' }}>1 Mile:</strong> 1.609 km</div>
          <div><strong style={{ color: '#00ff88' }}>1 kWh:</strong> 1,000 Wh</div>
          <div><strong style={{ color: '#00ff88' }}>Power:</strong> Voltage × Current</div>
        </div>
      </div>

    </div>
  );
}
