import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useAuth } from './auth';
import firebase from './firebase';
import slugify from './utils/slugify';

const useRooms = () => {
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [roomsFetched, setRoomsFetched] = useState(false);
  const auth = useAuth();
  const router = useRouter();

  const db = firebase.firestore();

  const route = router.asPath;
  const docID = router.asPath.substring(route.lastIndexOf('/') + 1);
  const pid = router.query.id;

  const fetchRooms = async () => {
    setLoading(true);
    const roomsResult = await db
      .collection('groups')
      .doc(docID)
      .collection('rooms')
      .get()
      .then((snapShot) => {
        console.log('Got roomsssss ', snapShot);
        snapShot.forEach((doc) => {
          console.log('Got room: ', doc.data());
          setRooms((rooms) => [...rooms, doc.data()]);
        });
        setLoading(false);
        console.log('ROOMS FETCHED IS ', roomsFetched);
        setRoomsFetched(true);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        return err;
      });

    return roomsResult;
  };

  // Receives object from react-hook-form
  const createRoom = async (groupID, values) => {
    const slug = await slugify(values.name);
    setLoading(true);
    console.log(groupID);
    return await db
      .collection('groups')
      .doc(groupID)
      .collection('rooms')
      .doc(slug)
      .set(
        {
          name: values.name,
          description: values.description,
          author: auth.user.uid,
          slug: slug,
          parentGroupID: groupID,
          dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      )
      .then(() => {
        console.log('success!');
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        return err;
      });
  };

  // useEffect(() => {
  //   if (
  //     auth.user &&
  //     auth.userData &&
  //     !roomsFetched &&
  //     router.route.startsWith('/groups/')
  //   ) {
  //     console.log(router.route);
  //     console.log('fetching rooms now........');
  //     fetchRooms();
  //     console.log('AUTH IS ==> ', auth);
  //     console.log('AUTH DATA IS ==>', auth.userData);
  //   }
  // }, [auth.user, auth.userData, router.route]);

  useEffect(() => {
    const unsubscribe = db
      .collection('groups')
      .doc(pid)
      .collection('rooms')
      .orderBy('dateCreated', 'asc')
      .onSnapshot((docs) => {
        let results = [];
        docs.forEach((doc) => {
          results.push(doc.data());
          console.log('found room => ', doc.data());
        });
        setRooms((rooms) => [...rooms, ...results]);
      });

    setRoomsFetched(true);

    return () => unsubscribe();
  }, [auth.userData]);

  return {
    createRoom,
    fetchRooms,
    rooms: rooms,
    roomsLoading: loading,
  };
};

export default useRooms;
