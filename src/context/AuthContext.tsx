import { User, getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import { Redirect } from "react-router";
import { Purchases } from "@revenuecat/purchases-capacitor";
import { Capacitor } from "@capacitor/core";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { FirebaseAnalytics } from "@capacitor-firebase/analytics";

interface AuthProps {
  user?: User | null;
  initialized?: boolean;
  logout?: () => Promise<void>;
}

const signOutUser = async () => {
  if (Capacitor.isNativePlatform()) {
    await FirebaseAuthentication.signOut();
  }

  await signOut(FIREBASE_AUTH);
};

export const AuthContext = createContext<AuthProps>({
  user: null,
  initialized: false,
  logout: () => signOutUser(),
});

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Listener for auth state changes
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log("AUTH CHANGED: ", user);
      if (user) {
        Purchases.logIn({ appUserID: user.uid });
        console.log(user);
      }
      setUser(user);
      setInitialized(true);
    });
  }, []);

  const value = {
    user,
    initialized,
    logout: () => signOutUser(),
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
