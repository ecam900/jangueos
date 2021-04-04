import {
  Container,
  IconButton,
  makeStyles,
  Paper,
  Tooltip,
  Typography,
  useTheme,
} from '@material-ui/core';
import { ClearTwoTone, ChatTwoTone } from '@material-ui/icons';
import { motion } from 'framer-motion';
import React from 'react';
import firebase from '@/lib/firebase';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/router';

const db = firebase.firestore();

const useStyles = makeStyles((theme) => ({
  root: {
    // marginBottom: theme.spacing(1),
  },
  notiContent: {
    // opacity: 0.8,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
}));

const NotificationItem = ({ notification, open, setOpen }) => {
  const classes = useStyles();
  const theme = useTheme();
  const auth = useAuth();
  const router = useRouter();

  const dismissNotification = () => {
    db.collection('users')
      .doc(auth.user.uid.toString())
      .collection('notifications')
      .doc(notification.notificationID)
      .set({ seen: true }, { merge: true })
      .catch((err) => {
        console.log('ERROR DISMISSING NOTIFICATION', err);
      });
  };

  // const goToComment = (route) => {

  // }

  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
    >
      <Paper elevation={4}>
        <Container className={classes.root}>
          <Typography variant='body2' style={{ paddingBottom: 0 }}>
            <span style={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
              En Post:
            </span>{' '}
            {notification.postTitle}
          </Typography>
          <Typography style={{}} variant='body2'>
            <span style={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
              Cuarto:
            </span>{' '}
            {notification.roomID}
          </Typography>

          <Typography
            variant='body2'
            style={{ paddingTop: 0 }}
            className={classes.notiContent}
          >
            <span style={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
              {notification.authorName} comentó...
            </span>{' '}
            {notification.content}
          </Typography>
          <div className={classes.actions}>
            <Tooltip title='go to comment'>
              <IconButton
                onClick={() => {
                  router.push(notification.url);
                  setOpen(false);
                }}
              >
                <ChatTwoTone color='primary' />
              </IconButton>
            </Tooltip>
            <Tooltip title='dismiss'>
              <IconButton onClick={dismissNotification}>
                <ClearTwoTone color='primary' />
              </IconButton>
            </Tooltip>
          </div>
        </Container>
      </Paper>
    </motion.div>
  );
};

export default NotificationItem;
