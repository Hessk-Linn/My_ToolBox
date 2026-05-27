import { pgTable, serial, text, real, integer, bigint, timestamp } from "drizzle-orm/pg-core";

export const appUsers = pgTable("app_users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  pin: text("pin").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const batteryReadings24v = pgTable("battery_readings_24v", {
  id: text("id").primaryKey(),
  voltage: real("voltage").notNull(),
  pct: integer("pct").notNull(),
  alert: text("alert").notNull(),
  ts: text("ts").notNull(),
  recordedBy: text("recorded_by"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const homeSolarReadings48v = pgTable("home_solar_readings_48v", {
  id: text("id").primaryKey(),
  voltage: real("voltage").notNull(),
  pct: integer("pct").notNull(),
  alert: text("alert").notNull(),
  ts: text("ts").notNull(),
  recordedBy: text("recorded_by"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const fuelTrips = pgTable("fuel_trips", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  distance: real("distance").notNull(),
  unit: text("unit").notNull(),
  efficiency: real("efficiency").notNull(),
  pricePerLiter: real("price_per_liter").notNull(),
  cost: real("cost").notNull(),
  liters: real("liters").notNull(),
  tripTimestamp: bigint("trip_timestamp", { mode: "number" }).notNull(),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const fuelPrices = pgTable("fuel_prices", {
  id: text("id").primaryKey(),
  priceMmk: real("price_mmk").notNull(),
  note: text("note"),
  recordedBy: text("recorded_by"),
  recordedAt: timestamp("recorded_at").defaultNow(),
});

export type AppUser = typeof appUsers.$inferSelect;
export type BatteryReading24v = typeof batteryReadings24v.$inferSelect;
export type HomeSolarReading48v = typeof homeSolarReadings48v.$inferSelect;
export type FuelTrip = typeof fuelTrips.$inferSelect;
export type FuelPrice = typeof fuelPrices.$inferSelect;
