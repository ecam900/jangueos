const admin = require('firebase-admin');
admin.initializeApp();

const createUser = require('./createUser');
const notificationOnComment = require('./notificationOnComment');
const makeAdmin = require('./makeAdmin');
const setPassword = require('./setPassword');

exports.createUser = createUser.createUser;
exports.notificationOnComment = notificationOnComment.notificationOnComment;
exports.makeAdmin = makeAdmin.makeAdmin;
exports.setPassword = setPassword.setPassword;
