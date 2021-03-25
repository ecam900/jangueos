const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

exports.makeAdmin = functions.https.onCall((data, context) => {
  console.log('AUTH CONTEXT IS ==> ', context.auth.uid);

  return { success: true };
});
