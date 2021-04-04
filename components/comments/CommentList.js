import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Comment from './Comment';
import firebase from '../../lib/firebase';

const db = firebase.firestore();

const CommentList = () => {
  const router = useRouter();
  const [comments, setComments] = useState([]);

  const { id, room, post } = router.query;

  useEffect(() => {
    const unsubscribe = db
      .collection('groups')
      .doc(id)
      .collection('rooms')
      .doc(room)
      .collection('posts')
      .doc(post)
      .collection('comments')
      .orderBy('dateCreated', 'desc')
      .onSnapshot(
        (snapshot) => {
          const results = [];
          snapshot.forEach((doc) => {
            results.push(doc.data());
          });
          setComments(results);
        },
        (err) => {
          console.log('ERROR: ', err);
        }
      );

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {comments && (
        <>
          <AnimatePresence>
            {comments.map((comment) => (
              <Comment key={comment.commentID} commentData={comment} />
            ))}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default CommentList;
