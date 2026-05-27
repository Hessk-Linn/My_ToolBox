import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { getDb } from './firebase';

export interface BatteryReading {
  id: string;
  voltage: number;
  pct: number;
  alert: string;
  ts: string;
  createdAt?: Timestamp;
}

export interface FuelTrip {
  id: string;
  name: string;
  distance: number;
  unit: 'km' | 'mile';
  efficiency: number;
  pricePerLiter: number;
  cost: number;
  liters: number;
  tripTimestamp: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface FuelPrice {
  id: string;
  priceMmk: number;
  note: string | null;
  recordedAt?: Timestamp;
}

export const firebaseApi = {
  battery: {
    getReadings: async (): Promise<BatteryReading[]> => {
      const db = getDb();
      const q = query(
        collection(db, 'battery_readings_24v'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as BatteryReading[];
    },

    addReading: async (reading: Omit<BatteryReading, 'id' | 'createdAt'>): Promise<BatteryReading> => {
      const db = getDb();
      const docRef = await addDoc(collection(db, 'battery_readings_24v'), {
        ...reading,
        createdAt: serverTimestamp(),
      });
      return { id: docRef.id, ...reading };
    },

    deleteReading: async (id: string): Promise<void> => {
      const db = getDb();
      await deleteDoc(doc(db, 'battery_readings_24v', id));
    },
  },

  homeSolar: {
    getReadings: async (): Promise<BatteryReading[]> => {
      const db = getDb();
      const q = query(
        collection(db, 'home_solar_readings_48v'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as BatteryReading[];
    },

    addReading: async (reading: Omit<BatteryReading, 'id' | 'createdAt'>): Promise<BatteryReading> => {
      const db = getDb();
      const docRef = await addDoc(collection(db, 'home_solar_readings_48v'), {
        ...reading,
        createdAt: serverTimestamp(),
      });
      return { id: docRef.id, ...reading };
    },

    deleteReading: async (id: string): Promise<void> => {
      const db = getDb();
      await deleteDoc(doc(db, 'home_solar_readings_48v', id));
    },
  },

  fuel: {
    getTrips: async (): Promise<FuelTrip[]> => {
      const db = getDb();
      const q = query(
        collection(db, 'fuel_trips'),
        orderBy('tripTimestamp', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FuelTrip[];
    },

    addTrip: async (trip: Omit<FuelTrip, 'id' | 'createdAt' | 'updatedAt'>): Promise<FuelTrip> => {
      const db = getDb();
      const docRef = await addDoc(collection(db, 'fuel_trips'), {
        ...trip,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { id: docRef.id, ...trip };
    },

    updateTrip: async (id: string, trip: Partial<FuelTrip>): Promise<void> => {
      const db = getDb();
      await updateDoc(doc(db, 'fuel_trips', id), {
        ...trip,
        updatedAt: serverTimestamp(),
      });
    },

    deleteTrip: async (id: string): Promise<void> => {
      const db = getDb();
      await deleteDoc(doc(db, 'fuel_trips', id));
    },

    getPrices: async (): Promise<FuelPrice[]> => {
      const db = getDb();
      const q = query(
        collection(db, 'fuel_prices'),
        orderBy('recordedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FuelPrice[];
    },

    addPrice: async (price: Omit<FuelPrice, 'id' | 'recordedAt'>): Promise<FuelPrice> => {
      const db = getDb();
      const docRef = await addDoc(collection(db, 'fuel_prices'), {
        ...price,
        recordedAt: serverTimestamp(),
      });
      return { id: docRef.id, ...price };
    },

    deletePrice: async (id: string): Promise<void> => {
      const db = getDb();
      await deleteDoc(doc(db, 'fuel_prices', id));
    },
  },
};
