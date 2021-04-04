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
  const [editData, setEditData] = useState(null);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const isOwner = () => {
    if (auth.user.uid === commentData.author) {
      return true;
    }
    return false;
  };

  const saveCommentUpdate = async () => {};

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

                  {editCommentOpen && (
                    <>
                      <IconButton
                        className={classes.editComment}
                        onClick={() => console.log('Delete Comment Pressed')}
                      >
                        <Delete color='error' />
                      </IconButton>

                      <IconButton
                        className={classes.editComment}
                        onClick={() => console.log('Save Comment Update Pressed')}
                      >
                        <SaveOutlined color='primary' />
                      </IconButton>
                    </>
                  )}
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
