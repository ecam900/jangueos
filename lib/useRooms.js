import { useRouter } from 'next/router';
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './auth';
import firebase from './firebase';

const roomsContext = createContext();

export const RoomsProvider = ({ children }) => {
  const rooms = useProvideRooms();
  return (
    <roomsContext.Provider value={rooms}>{children}</roomsContext.Provider>
  );
};

export const useRooms = () => {
  return useContext(roomsContext);
};

const useProvideRooms = () => {
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const auth = useAuth();
  const router = useRouter();

  const db = firebase.firestore();

  const route = router.asPath;
  const docID = router.asPath.substring(route.lastIndexOf('/') + 1);

  const fetchRooms = async () => {
    console.log('fetching rooms');
    setLoading(true);
    await db
      .collection('groups')
      .doc(docID)
      .collection('rooms')
      .get()
      .then((snapShot) => {
        console.log('got Data');
        snapShot.forEach((doc) => {
          console.log('Got room: ', doc.data());
          setRooms((rooms) => [...rooms, doc.data()]);
        });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        return err;
      });
  };

  // Receives object from react-hook-form
  const createRoom = async (groupID, values) => {
    setLoading(true);
    console.log(groupID);
    return await db
      .collection('groups')
      .doc(groupID)
      .collection('rooms')
      .add({
        name: values.name,
        description: values.description,
        author: auth.user.uid,
        dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((docRef) => {
        db.collection('groups')
          .doc(docRef.id)
          .set({ uid: docRef.id }, { merge: true })
          .then(() => {
            console.log('success!');
            setLoading(false);
          });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        return err;
      });
  };

  // const createRoom = async (values) => {
  //   setLoading(true);

  //   return await db
  //     .collection('groups')
  //     .doc(docName)
  //     .set(
  //       {
  //         name: values.name,
  //         shortDescription: values.shortDescription,
  //         description: values.description,
  //         author: auth.user.uid,
  //         authorDisplay: auth.userData.username,
  //         members: [auth.userData.email],
  //         slug: docName,
  //       },
  //       { merge: true }
  //     )
  //     .then(() => {
  //       console.log('Done Creating Group');
  //       const memberships = auth.userData.memberships ?? [];
  //       const newMemberships = [...memberships, docName];
  //       db.collection('users')
  //         .doc(auth.user.uid)
  //         .set({ memberships: newMemberships }, { merge: true })
  //         .then(() => {
  //           console.log('User membership saved');
  //         })
  //         .catch((err) => {
  //           console.log('ERROR SAVING USER DATA: ', err);
  //           setLoading(false);
  //         });
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       console.log(`ERROR: ${err}`);
  //       setLoading(false);
  //     });
  // };

  // const fetchGroups = async () => {
  //   const userEmail = auth.userData.email;
  //   return await db
  //     .collection('groups')
  //     .where('members', 'array-contains', userEmail)
  //     .get()
  //     .then((snapshot) => {
  //       let results = [];
  //       snapshot.forEach((doc) => {
  //         results.push(doc.data());
  //       });
  //       console.log('FETCHED RESULTS: ', results);
  //       return results;
  //     })
  //     .catch((err) => {
  //       console.log('ERROR: ', err);
  //     });
  // };

  return {
    createRoom,
    fetchRooms,
    rooms: rooms,
    loading,
  };
};
