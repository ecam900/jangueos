const admin = require('firebase-admin');
const functions = require('firebase-functions');

const db = admin.firestore();

const generateNotification = async (snap) => {
  const commentData = snap.data();
  const result = await db
    .collection('users')
    .doc(commentData.postAuthor)
    .collection('notifications')
    .add({
      title: 'Alguien comento en tu post:',
      author: commentData.author,
      authorName: commentData.authorName,
      commentID: snap.id,
      content: commentData.content,
      date: commentData.dateCreated,
      groupID: commentData.group,
      postID: commentData.post,
      roomID: commentData.room,
      postTitle: commentData.postTitle,
      seen: false,
    })
    .then(async (docRef) => {
      const url = `/groups/${commentData.group}/${commentData.room}/${commentData.post}?id=${docRef.id}`;

      return await docRef.set({ notificationID: docRef.id, url: url }, { merge: true });
    })
    .catch((err) => {
      console.log('ERROR MAKING NOTIFICATION ', err);
      return err;
    });

  return { success: true, result: result };
};

exports.notificationOnComment = functions.firestore
  .document('/groups/{group}/rooms/{room}/posts/{post}/comments/{comment}')
  .onCreate(async (snap, context) => {
    const commentData = snap.data();

    const result = await generateNotification(snap);

    return result;
  });
