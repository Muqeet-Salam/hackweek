import { create } from "zustand";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";

const PROFILE_STORAGE_KEY = "hackweek-github-profile";

const readStoredProfile = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedProfile = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    return storedProfile ? JSON.parse(storedProfile) : null;
  } catch {
    return null;
  }
};

const writeStoredProfile = (profile) => {
  if (typeof window === "undefined") {
    return;
  }

  if (profile) {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    return;
  }

  window.localStorage.removeItem(PROFILE_STORAGE_KEY);
};

export const useAuthStore = create((set) => ({
  user: null,
  profile: readStoredProfile(),
  loading: true,

  setUser: (user) => set({ user }),

  setProfile: (profile) => {
    writeStoredProfile(profile);
    set({ profile });
  },

  clearProfile: () => {
    writeStoredProfile(null);
    set({ profile: null });
  },

  initAuth: () => {
    return onAuthStateChanged(auth, (user) => {
      if (!user) {
        writeStoredProfile(null);
        set({ user: null, profile: null, loading: false });
        return;
      }

      set({ user, profile: readStoredProfile(), loading: false });
    });
  },
}));