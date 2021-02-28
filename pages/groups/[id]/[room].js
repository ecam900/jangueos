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
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../../lib/auth';
import firebase from '../../../lib/firebase';
import BackButton from '../../../components/BackButton';
import Link from 'next/link';
import CreatePost from '../../../components/rooms/CreatePost';
import usePosts from '../../../lib/usePosts';
import {
  AddBox,
  AddBoxOutlined,
  AddBoxRounded,
  AddBoxTwoTone,
  PostAddOutlined,
} from '@material-ui/icons';

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
    // backgroundColor: 'coral',
    display: 'flex',
    flexDirection: 'column',
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
  const [loading, setLoading] = useState(true);

  const { room, id } = router.query;

  const { posts, postsLoading, createPost } = usePosts();

  return (
    <>
      <motion.div
        className={classes.svgBGroot}
        animate={{ opacity: 1, transition: { delay: 0.5, duration: 0.5 } }}
        initial={{ opacity: 0 }}
      >
        <Container maxWidth='md' className={classes.root}>
          {/* GROUP JOIN MODAL */}
          <AnimatePresence exitBeforeEnter>
            {openCreate && (
              <CreatePost
                createPost={createPost}
                loading={postsLoading}
                setOpenCreate={setOpenCreate}
                room={room}
                id={id}
              />
            )}
          </AnimatePresence>
        </Container>
        <NewPostButton setOpenCreate={setOpenCreate} />
      </motion.div>
    </>
  );
};

const NewPostButton = ({ setOpenCreate }) => {
  return (
    <motion.div
      initial={{ x: 500 }}
      animate={{ x: 0 }}
      exit={{ x: 500 }}
      style={{ position: 'fixed', zIndex: 2, bottom: '10%', right: '5%' }}
    >
      <Button onClick={() => setOpenCreate(true)}>
        <PostAddOutlined style={{ marginRight: '.25rem' }} />
        POST
      </Button>
    </motion.div>
  );
};

export default RoomDetail;
