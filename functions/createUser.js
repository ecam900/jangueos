const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

exports.createUser = functions.auth.user().onCreate((user) => {
  return db.collection('users').doc(user.uid).set(
    {
      uid: user.uid,
      email: user.email,
      hasPassword: false,
      emailVerified: user.emailVerified,
    },
    { merge: true }
  );
});
