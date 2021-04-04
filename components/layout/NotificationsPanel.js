import { Container, makeStyles, Typography } from '@material-ui/core';
import { AnimatePresence, motion } from 'framer-motion';
import firebase from '@/lib/firebase';
import React, { useEffect, useState } from 'react';
import NotificationItem from './NotificationItem';
import LoadingScreen from 'components/LoadingScreen';

const db = firebase.firestore();

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginBottom: theme.spacing(2),
    minHeight: '50vh',
  },
}));

const NotificationsPanel = ({ auth, setOpen, open }) => {
  const classes = useStyles();
  const [notifications, setNotifications] = useState(null);

  useEffect(() => {
    const unsubscribe = db
      .collection('users')
      .doc(auth.user.uid.toString())
      .collection('notifications')
      .where('seen', '!=', true)
      .orderBy('seen', 'desc')
      .orderBy('date', 'asc')
      .onSnapshot(
        (snapshots) => {
          const results = [];
          snapshots.forEach((notification) => {
            results.push(notification.data());
          });
          setNotifications(results);
        },
        (err) => {
          console.log('Error getting notifications: ', err);
        }
      );

    return () => unsubscribe();
  }, []);

  return (
    <motion.div className={classes.root}>
      <Typography variant='h4' align='center'>
        Notificaciones
      </Typography>
      <Container>
        <AnimatePresence>
          {notifications ? (
            notifications.map((noti, i) => (
              <NotificationItem
                key={`noti_${i}`}
                notification={noti}
                open={open}
                setOpen={setOpen}
              />
            ))
          ) : (
            <LoadingScreen />
          )}
        </AnimatePresence>
      </Container>
    </motion.div>
  );
};

export default NotificationsPanel;
