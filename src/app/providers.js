import { useEffect } from "react";
import { useAuthStore } from "../store/authstore";

export default function Providers({ children }) {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    const unsubscribe = initAuth();

    return unsubscribe;
  }, [initAuth]);

  return children;
}