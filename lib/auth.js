import { createContext, useContext, useEffect, useReducer } from 'react';
import firebase from './firebase';
import {
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  SIGN_OUT,
  START_LOADING,
  STOP_LOADING,
} from './reducers/authTypes';
import authReducer from './reducers/authReducer';
import { useRouter } from 'next/router';

const db = firebase.firestore();

const authContext = createContext();
const environment = process.env.NODE_ENV;

export const AuthProvider = ({ children }) => {
  const auth = useProvideAuth();

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export const useAuth = () => {
  return useContext(authContext);
};

export const initialState = {
  user: null,
  loading: true,
  userData: null,
};

function useProvideAuth() {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  // Email Link Authentication (AKA Magic Link, AKA Passwordless, AKA da bomb)
  const emailLinkAuth = async (email) => {
    var redirectURL =
      environment === 'development'
        ? 'http://localhost:3000'
        : 'https://jangueos.ecresdev.vercel.app/';

    var actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be whitelisted in the Firebase Console.
      url: redirectURL,
      // This must be true.
      handleCodeInApp: true,
      // dynamicLinkDomain: 'example.page.link',
    };

    return await firebase
      .auth()
      .sendSignInLinkToEmail(email, actionCodeSettings)
      .then(function () {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.

        window.localStorage.setItem('emailForSignIn', email);
        return true;
      })
      .catch(function (error) {
        // DISPATCH SIGNIN_WITH_LINK_FAIL
        console.log(`ERROR: ${error}`);
        return error;
      });
  };

  const finishEmailAuth = async () => {
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      var email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt('Please provide your email for confirmation');
      }
      // The client SDK will parse the code from the link for you.
      await firebase
        .auth()
        .signInWithEmailLink(email, window.location.href)
        .then(function (result) {
          // Clear email from storage.
          window.localStorage.removeItem('emailForSignIn');

          console.log('FOUND');
          // You can access the new user via result.user
          // Additional user info profile not available via:
          // result.additionalUserInfo.profile == null
          // You can check if the user is new or existing:
          // result.additionalUserInfo.isNewUser
          return true;
        })
        .catch(function (error) {
          console.log(`ERROR WITH FINISH REGISTER: ${error}`);
        });
    }
  };

  // Get User Info from Database
  const getUserInfo = async () => {
    return await db
      .collection('users')
      .where('uid', '==', state.user.uid)
      .get()
      .then((snapshot) => {
        const userData = snapshot.docs[0].data();
        dispatch({ type: USER_LOADED_SUCCESS, payload: userData });
        return userData;
      })
      .catch((err) => {
        console.log('Error getting user data from firebase => ', err);
        return false;
      });
  };

  // Signout
  const signOut = async () => {
    dispatch({ type: START_LOADING });

    return await firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch({ type: SIGNOUT, payload: initialState });
      })
      .then(() => {
        dispatch({ type: STOP_LOADING });
        router.reload();
      })
      .catch((err) => {
        dispatch({ type: STOP_LOADING });
        console.log('Could not log out...', err);
      });
  };

  // Get user info and check if user password is set.
  useEffect(() => {
    console.log('useEffect - Auth - checking user info...');

    !state.loading && dispatch({ type: START_LOADING });

    // 1. Get User Info, if available.
    if (state.user) {
      console.log('Fetching User Data...');
      (async () => {
        let userData = await getUserInfo();
        if (userData) {
          console.log('Successfully got user data => ', userData);
          dispatch({ type: USER_LOADED_SUCCESS, payload: userData });
          dispatch({ type: STOP_LOADING });
          return;
        } else {
          dispatch({ type: STOP_LOADING });

          console.log('Could not find user data.');
        }
      })();
      return;
    }

    // 2. Check if User has Password already set in their account.
    if (state.userInfo && !state.userPasswordSetupComplete) {
      console.log('Checking for user Password Finalization');
      if (state.userInfo.hasPassword) {
        console.log('USER ALREADY HAS A PASSWORD!');
        dispatch({ type: USER_PASSWORD_LOAD_SUCCESS });
      } else {
        console.log('NO PASSWORD DETECTED');

        dispatch({ type: USER_PASSWORD_LOAD_FAIL });
      }
      dispatch({ type: STOP_LOADING });
      return;
    }

    dispatch({ type: STOP_LOADING });
  }, [
    state.user,
    state.userRegistrationComplete,
    state.userPasswordSetupComplete,
  ]);

  // GET AUTH TOKEN - SETUP SUBSCRIPTION TO FIREBASE.
  useEffect(() => {
    console.log('Auth use effect ran');
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch({ type: LOGIN_SUCCESS, payload: user });
        dispatch({ type: STOP_LOADING });
        if (router.pathname === '/login') {
          router.push('/');
        }
      } else {
        dispatch({ type: LOGIN_FAIL });
        dispatch({ type: STOP_LOADING });
        if (router.pathname !== ('/login' || 'new-account')) {
          router.push('/login');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    user: state.user,
    loading: state.loading,
    userLoaded: state.userLoaded,
    userData: state.userData,
    signOut,
    emailLinkAuth,
    finishEmailAuth,
    getUserInfo,
  };
}
