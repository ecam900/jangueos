import React, { useState } from 'react';
import { useAuth } from './auth';
import firebase from './firebase';
import slugify from './utils/slugify';

const db = firebase.firestore();

const usePosts = () => {
  const auth = useAuth();
  const [loading, setLoading] = useState(false);

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
        .doc(slug)
        .set({
          title: values.title,
          description: values.description,
        })
        .then(() => setLoading(false))
        .catch((err) => {
          console.log('ERROR CREATING POST: ', err);
          setLoading(false);
          return err;
        });
    }
    return null;
  };

  return {
    createPost,
    loading,
  };
};

export default usePosts;
