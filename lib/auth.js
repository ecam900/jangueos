// import { createContext, useContext, useReducer } from 'react';
// import firebase from './firebase';
// import { START_LOADING, STOP_LOADING } from './reducers/authTypes';
// import authReducer from './reducers/authReducer';
// import LoadingScreen from '../components/LoadingScreen.js';

// const db = firebase.firestore();

// const authContext = createContext();

// export const AuthProvider = (children) => {
//   const auth = useProvideAuth();
//   <authContext.Provider value={auth}>
//     {auth.loading ? <LoadingScreen /> : { children }}
//   </authContext.Provider>;
// };

// export const useAuth = () => {
//   return useContext(authContext);
// };

// const initialState = {
//   user: null,
//   loading: false,
//   // userLoaded ==> Finished getting user info from Database (not the same as firebaseAuth token)
//   userLoaded: false,
// };

// function useProvideAuth() {
//   const [state, dispatch] = useReducer(authReducer, initialState);

//   return {
//     user: state.user,
//     loading: state.loading,
//     userLoaded: state.userLoaded,
//   };
// }
