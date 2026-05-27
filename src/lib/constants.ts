export const VOLTAGE_24V = {
  MIN: 20.0,
  MAX: 29.2,
  CRITICAL: 22.0,
  WARNING: 24.0,
  CELLS: 8,
  CHEMISTRY: 'LiFePO4',
} as const;

export const VOLTAGE_48V = {
  MIN: 44.0,
  MAX: 54.4,
  CRITICAL: 48.0,
  WARNING: 50.0,
  CELLS: 16,
  CHEMISTRY: 'LiFePO4',
  CAPACITY_AH: 300,
  CAPACITY_KWH: 14.4,
} as const;

export const SYSTEM_CONFIG = {
  INVERTER: 'Growatt 6kW',
  PANELS: '8× Trina 575W',
  BATTERY: '300Ah CATL',
  CONFIG: '16S LiFePO4',
} as const;

export const REFETCH_INTERVAL = 30_000;
export const STALE_TIME = 5_000;
export const GC_TIME = 30_000;
