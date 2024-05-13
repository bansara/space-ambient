import {
  User,
  getRedirectResult,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
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

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [initialized, setInitialized] = useState(false);

//   useEffect(() => {
//     onAuthStateChanged(FIREBASE_AUTH, (user) => {
//       console.log("AUTH CHANGED: ", user);

//       setUser(user);
//       setInitialized(true);
//     });
//   }, []);

//   const value = {
//     user,
//     initialized,
//     logout: () => signOut(FIREBASE_AUTH),
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Check for the result of a redirect operation such as signInWithRedirect.
    getRedirectResult(FIREBASE_AUTH)
      .then((result) => {
        if (result) {
          // There's a user object after the redirect—no need to set the user here
          // as onAuthStateChanged will trigger immediately after with the user.
          console.log("Redirect login successful: ", result.user);
        }
      })
      .catch((error) => {
        console.error("Redirect result failed: ", error);
      });

    // Listener for auth state changes
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log("AUTH CHANGED: ", user);
      setUser(user);
      setInitialized(true);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
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
