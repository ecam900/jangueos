import {
  Button,
  Container,
  IconButton,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import QuestionAnswerOutlinedIcon from '@material-ui/icons/QuestionAnswerOutlined';
import AddBoxTwoToneIcon from '@material-ui/icons/AddBoxTwoTone';
// import firebase from '../../../../lib/firebase;
import firebase from '@/lib/firebase';
import { useRouter } from 'next/router';
import { AddBox, ChevronLeft } from '@material-ui/icons';
import ReactMarkdownWithHtml from 'react-markdown/with-html';
import { useAuth } from '@/lib/auth';
import { useSnackbar } from 'notistack';
import CreateCommentModal from 'components/comments/CreateCommentModal';
import { AnimatePresence } from 'framer-motion';
import CommentList from 'components/comments/CommentList';

const db = firebase.firestore();

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '10vh',
  },
  backButton: {
    display: 'flex',
    paddingTop: theme.spacing(4),
    alignItems: 'center',
    color: theme.palette.primary.main,
    fontSize: '.5rem',
    cursor: 'pointer',
  },
  postBody: {
    paddingBottom: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const PostHeader = (props) => {
  return <Typography variant='h5'>{props.children}</Typography>;
};

const Post = () => {
  const classes = useStyles();
  const auth = useAuth();
  const router = useRouter();
  const [postData, setPostData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [createCommentOpen, setCreateCommentOpen] = useState(false);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { id, post, room } = router.query;

  const isOwner = () => {
    if (auth?.user?.uid === postData.author) {
      return true;
    }
    return false;
  };

  const getPostDescription = () => {
    setEditData(() => postData.description);
  };

  const submitDescriptionEdit = async () => {
    setLoading(true);
    if (isOwner()) {
      await db
        .collection('groups')
        .doc(id)
        .collection('rooms')
        .doc(room)
        .collection('posts')
        .doc(post)
        .set({ description: editData }, { merge: true })
        .then(() => {
          enqueueSnackbar(`Post editado!`, { variant: 'success' });
          setEditMode(false);
        })
        .catch((err) => {
          console.log('ERROR UPDATING POST: ', err);
          enqueueSnackbar(`Hubo un error editando ese post: ${err}`, {
            variant: 'error',
          });
        });
    }

    setLoading(false);
  };

  // Create comment on post
  const createComment = async (values) => {
    setLoading(true);
    await db
      .collection('groups')
      .doc(id)
      .collection('rooms')
      .doc(room)
      .collection('posts')
      .doc(post)
      .collection('comments')
      .add({
        content: values.description,
        author: auth.user.uid,
        authorName: auth.userData.username,
        dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
        group: id,
        room: room,
        post: post,
        postAuthor: postData.author,
        postTitle: postData.title,
        likes: 0,
      })
      .then((docRef) => {
        docRef.set({ commentID: docRef.id }, { merge: true });
      })
      .then(() => setLoading(false));
  };

  // React-markdwon renderers for mapping to MUI Components.
  const renderers = {
    heading: PostHeader,
  };

  useEffect(() => {
    const unsubscribe = db
      .collection('groups')
      .doc(id)
      .collection('rooms')
      .doc(room)
      .collection('posts')
      .doc(post)
      .onSnapshot(
        (docSnapshot) => {
          setPostData(() => docSnapshot.data());
          console.log('Set postData to ===> ', docSnapshot.data());
        },
        (err) => {
          console.log('ERROR SETTING UP POST LISTENER: ', err);
        }
      );

    return () => unsubscribe();
  }, []);

  return (
    <>
      {postData ? (
        <Container className={classes.root}>
          <div onClick={() => router.back()} className={classes.backButton}>
            <ChevronLeft />
            <Typography style={{ fontSize: '1rem' }}>P'atras</Typography>
          </div>
          <Typography variant='h3'>{postData.title}</Typography>
          <Paper>
            <Container className={classes.postBody}>
              {isOwner() && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <Button
                    variant='outlined'
                    onClick={() => {
                      setEditMode(!editMode);
                      getPostDescription();
                    }}
                  >
                    {editMode ? 'CANCELAR' : 'EDITAR'}
                  </Button>

                  {editMode && (
                    <Button onClick={submitDescriptionEdit}>
                      {loading ? 'PERATE' : 'GUARDAR'}
                    </Button>
                  )}
                </div>
              )}

              {!editMode ? (
                <ReactMarkdownWithHtml
                  source={postData.description}
                  allowDangerousHtml
                  renderers={renderers}
                />
              ) : (
                <TextField
                  value={editData}
                  onChange={(e) => setEditData(e.target.value)}
                  variant='outlined'
                  fullWidth
                  multiline
                />
              )}
            </Container>
          </Paper>

          {/*  COMMENTS SECTION */}
          <Paper>
            <Container className={classes.commentsSection}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <QuestionAnswerOutlinedIcon style={{ marginRight: '1rem' }} />

                  <Typography variant='h4'>Comentarios</Typography>
                </div>

                <div>
                  <IconButton onClick={() => setCreateCommentOpen(true)}>
                    <AddBoxTwoToneIcon color='primary' />
                  </IconButton>
                </div>
              </div>
            </Container>
            <Container>
              <CommentList />
            </Container>
          </Paper>
        </Container>
      ) : (
        <div>Loading...</div>
      )}

      <AnimatePresence exitBeforeEnter>
        {createCommentOpen && (
          <CreateCommentModal
            post={postData}
            setCreateCommentOpen={setCreateCommentOpen}
            createComment={createComment}
            loading={loading}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Post;
