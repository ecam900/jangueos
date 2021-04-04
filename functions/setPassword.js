const functions = require('firebase-functions');
const admin = require('firebase-admin');

const db = admin.firestore();

exports.setPassword = functions.https.onCall((data, context) => {
  console.log('DATA IS: ', data);

  return { success: true };
});
