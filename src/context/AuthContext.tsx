import { User, onAuthStateChanged, signOut } from "firebase/auth";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import { Redirect } from "react-router";

interface AuthProps {
  user?: User | null;
  initialized?: boolean;
  logout?: () => Promise<void>;
}

export const AuthContext = createContext<AuthProps>({
  user: null,
  initialized: false,
  logout: () => signOut(FIREBASE_AUTH),
});

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log("AUTH CHANGED: ", user);

      setUser(user);
      setInitialized(true);
    });
  }, []);

  const value = {
    user,
    initialized,
    logout: () => signOut(FIREBASE_AUTH),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const AuthenticatedRoute = ({ children }: any) => {
  const { user, initialized } = useAuth();

  if (!initialized) {
    return;
  }

  return user ? children : <Redirect to="/auth" />;
};
