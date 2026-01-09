import { create } from 'zustand';

export interface NearbyUser {
  userId: string;
  name: string;
  photoUrl: string | null;
  distance: number;
  direction: string;
  bearing: number;
  age: number | null;
  profession: string | null;
  maritalStatus: string | null;
  bio: string | null;
}

export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  heading?: number;
}

interface LocationState {
  currentLocation: Location | null;
  nearbyUsers: NearbyUser[];
  isTracking: boolean;
  error: string | null;
  setLocation: (location: Location) => void;
  setNearbyUsers: (users: NearbyUser[]) => void;
  startTracking: () => void;
  stopTracking: () => void;
  setError: (error: string | null) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  currentLocation: null,
  nearbyUsers: [],
  isTracking: false,
  error: null,

  setLocation: (location: Location) => {
    set({ currentLocation: location, error: null });
  },

  setNearbyUsers: (users: NearbyUser[]) => {
    set({ nearbyUsers: users });
  },

  startTracking: () => {
    set({ isTracking: true });
  },

  stopTracking: () => {
    set({ isTracking: false });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
