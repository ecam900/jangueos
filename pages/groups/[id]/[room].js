import {
  Button,
  Container,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../lib/auth';
import firebase from '../../../lib/firebase';
import BackButton from '../../../components/BackButton';
import Link from 'next/link';
import CreatePost from '../../../components/rooms/CreatePost';

const db = firebase.firestore();

const useStyles = makeStyles((theme) => ({
  svgBGroot: {
    height: '100%',
    minHeight: '300vh',
    background: `url('/dunebg.svg') no-repeat center center`,
    backgroundSize: 'cover',
    [theme.breakpoints.down('sm')]: {
      minHeight: '100vh',
    },
    paddingTop: '10vh',
  },
  root: {
    height: '100% ',
    paddingBottom: theme.spacing(2),
  },

  paper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
}));

const RoomDetail = () => {
  const classes = useStyles();
  const router = useRouter();
  const auth = useAuth();
  const [openCreate, setOpenCreate] = useState(true);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { room, id } = router.query;

  useEffect(() => {
    console.log(router.query);
  }, []);

  return (
    <>
      <motion.div
        className={classes.svgBGroot}
        animate={{ opacity: 1, transition: { delay: 0.5, duration: 0.5 } }}
        initial={{ opacity: 0 }}
      >
        <Container maxWidth='md' className={classes.root}>
          <Paper className={classes.paper}>
            {openCreate && (
              <CreatePost setOpenCreate={setOpenCreate} room={room} id={id} />
            )}
          </Paper>
        </Container>
      </motion.div>
    </>
  );
};

export default RoomDetail;
