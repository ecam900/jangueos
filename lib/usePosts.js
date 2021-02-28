import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAuth } from './auth';
import firebase from './firebase';
import slugify from './utils/slugify';

const db = firebase.firestore();

const usePosts = () => {
  const auth = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  const { id, room } = router.query;

  const createPost = async (groupID, roomID, values) => {
    const slug = await slugify(values.title);
    if (auth.userData) {
      setLoading(true);
      return await db
        .collection('groups')
        .doc(groupID)
        .collection('rooms')
        .doc(roomID)
        .collection('posts')
        .add({
          title: values.title,
          description: values.description,
          author: auth.user.uid,
          dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
          parentGroup: groupID,
          parentRoom: roomID,
        })
        .then((docRef) => setLoading(false))
        .catch((err) => {
          console.log('ERROR CREATING POST: ', err);
          setLoading(false);
          return err;
        });
    }
    return null;
  };

  useEffect(() => {
    const unsubscribe = db
      .collection('groups')
      .doc(id)
      .collection('rooms')
      .doc(room)
      .collection('posts')
      .onSnapshot(
        (docs) => {
          let results = [];
          docs.forEach((doc) => {
            console.log('got post: ', doc.data());
            results.push(doc.data());
          });
          setPosts((posts) => [...new Set([...posts, ...results])]);
        },
        (err) => {
          return err;
        }
      );

    return () => unsubscribe();
  }, [auth.userData]);

  return {
    posts,
    createPost,
    postsLoading: loading,
  };
};

export default usePosts;
