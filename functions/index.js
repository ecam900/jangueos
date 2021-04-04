const admin = require('firebase-admin');
admin.initializeApp();

const createUser = require('./createUser');
const notificationOnComment = require('./notificationOnComment');
const makeAdmin = require('./makeAdmin');

exports.createUser = createUser.createUser;
exports.notificationOnComment = notificationOnComment.notificationOnComment;
exports.makeAdmin = makeAdmin.makeAdmin;
