import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAuth } from './auth';
import firebase from './firebase';
import slugify from './utils/slugify';

const db = firebase.firestore();

const usePosts = () => {
  const auth = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const { id, room } = router.query;

  const createPost = async (groupID, roomID, values) => {
    const slug = await slugify(values.title);
    if (auth.userData) {
      setLoading(true);
      let newPost = db
        .collection('groups')
        .doc(groupID)
        .collection('rooms')
        .doc(roomID)
        .collection('posts')
        .doc();
      return await newPost
        .set(
          {
            title: values.title,
            description: values.description,
            author: auth.user.uid,
            authorName: auth.userData.username,
            dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
            parentGroup: groupID,
            parentRoom: roomID,
            postID: newPost.id,
          },
          { merge: true }
        )
        .then(() => setLoading(false))
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
      .orderBy('dateCreated', 'desc')
      .onSnapshot(
        (docs) => {
          let results = [];
          docs.forEach((doc) => {
            console.log('got post: ', doc.data());
            results.push(doc.data());
          });
          setPosts(results);
        },
        (err) => {
          return err;
        }
      );

    setLoading(false);
    return () => unsubscribe();
  }, []);

  return {
    posts,
    createPost,
    postsLoading: loading,
  };
};

export default usePosts;
