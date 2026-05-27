import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface UserContextValue {
  userName: string | null;
  setUserName: (name: string | null) => void;
  signOut: () => void;
}

const UserContext = createContext<UserContextValue>({
  userName: null,
  setUserName: () => {},
  signOut: () => {},
});

const SESSION_KEY = "app_user_name";

export function UserProvider({ children }: { children: ReactNode }) {
  const [userName, setUserNameState] = useState<string | null>(
    () => sessionStorage.getItem(SESSION_KEY)
  );

  const setUserName = useCallback((name: string | null) => {
    if (name) {
      sessionStorage.setItem(SESSION_KEY, name);
    } else {
      sessionStorage.removeItem(SESSION_KEY);
    }
    setUserNameState(name);
  }, []);

  const signOut = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setUserNameState(null);
  }, []);

  return (
    <UserContext.Provider value={{ userName, setUserName, signOut }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
