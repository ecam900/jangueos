import {
  Container,
  IconButton,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import CreateTwoToneIcon from '@material-ui/icons/CreateTwoTone';
import { motion } from 'framer-motion';
import date from 'date-and-time';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { CloseOutlined, Delete, SaveAltOutlined, SaveOutlined } from '@material-ui/icons';
import { useSnackbar } from 'notistack';
import firebase from '../../lib/firebase';
import { useRouter } from 'next/router';

const db = firebase.firestore();

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
  },
  editComment: {
    '& .MuiButtomBase-root': {
      marginBottom: '0',
      paddingBottom: '0',
    },
    marginBottom: 0,
    paddingBottom: 0,
  },
}));

const Comment = ({ commentData }) => {
  const classes = useStyles();
  const auth = useAuth();
  const [formattedDate, setFormattedDate] = useState(null);
  const [editCommentOpen, setEditCommentOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState(null);
  const router = useRouter();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const isOwner = () => {
    if (auth.user.uid === commentData.author) {
      return true;
    }
    return false;
  };

  const saveCommentUpdate = async () => {
    setLoading(true);
    await db
      .collection('groups')
      .doc(commentData.group)
      .collection('rooms')
      .doc(commentData.room)
      .collection('posts')
      .doc(commentData.post)
      .collection('comments')
      .doc(commentData.commentID)
      .set({ content: editData }, { merge: true })
      .then(() => {
        enqueueSnackbar('Comentario editado 👍', { variant: 'success' });
        setEditCommentOpen(false);
        setLoading(false);
      })
      .catch((err) => {
        console.log('ERROR SAVING COMMENT: ', err);
        enqueueSnackbar(`Hubo un error editando el comment... ${err}`, {
          variant: 'error',
        });
      });
  };

  const deleteComment = async () => {
    setLoading(true);
    await db
      .collection('groups')
      .doc(commentData.group)
      .collection('rooms')
      .doc(commentData.room)
      .collection('posts')
      .doc(commentData.post)
      .collection('comments')
      .doc(commentData.commentID)
      .set({ content: '[DELETED]' }, { merge: true })
      .then(() => {
        enqueueSnackbar('Comentario Borrado 🔥', { variant: 'success' });
        setEditCommentOpen(false);
        setLoading(false);
      })
      .catch((err) => {
        console.log('ERROR SAVING COMMENT: ', err);
        enqueueSnackbar(`Hubo un error borrando el comentario 😞... ${err}`, {
          variant: 'error',
        });
      });
  };

  useEffect(() => {
    const formatDate = async () => {
      const formatted = commentData.dateCreated.toDate().toDateString();
      setFormattedDate(formatted);
    };
    const getEditData = () => {
      if (commentData.content) {
        setEditData(commentData.content);
      }
    };

    if (commentData.dateCreated) {
      formatDate();
    }
    getEditData();
  }, []);
  return (
    <motion.div className={classes.root}>
      <Paper>
        <Container className={classes.root}>
          {!editCommentOpen ? (
            <Typography>{commentData.content}</Typography>
          ) : (
            <TextField
              variant='outlined'
              multiline
              fullWidth
              value={editData}
              onChange={(e) => setEditData(e.target.value)}
            />
          )}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            {!editCommentOpen && (
              <Typography variant='subtitle2' style={{ color: 'grey' }}>
                {commentData.authorName} - {formattedDate}
              </Typography>
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                width: '100%',
              }}
            >
              {isOwner() && (
                <>
                  {editCommentOpen && (
                    <>
                      <IconButton className={classes.editComment} onClick={deleteComment}>
                        <Delete color='error' />
                      </IconButton>

                      <IconButton
                        className={classes.editComment}
                        onClick={saveCommentUpdate}
                      >
                        <SaveOutlined color='primary' />
                      </IconButton>
                    </>
                  )}
                  <IconButton
                    className={classes.editComment}
                    onClick={() => {
                      setEditCommentOpen(!editCommentOpen);
                    }}
                  >
                    {editCommentOpen ? (
                      <CloseOutlined color='primary' />
                    ) : (
                      <CreateTwoToneIcon color='primary' />
                    )}
                  </IconButton>
                </>
              )}
            </div>
          </div>
        </Container>
      </Paper>
    </motion.div>
  );
};

export default Comment;
