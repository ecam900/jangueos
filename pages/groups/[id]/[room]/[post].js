import { Container, makeStyles, Paper, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
// import firebase from '../../../../lib/firebase;
import firebase from '@/lib/firebase';
import { useRouter } from 'next/router';
import { ChevronLeft } from '@material-ui/icons';
import ReactMarkdownWithHtml from 'react-markdown/with-html';

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
}));

const PostHeader = (props) => {
  console.log('Props are ==> ', props);
  return <Typography variant='h5'>{props.children}</Typography>;
};

const Post = () => {
  const classes = useStyles();
  const router = useRouter();
  const [postData, setPostData] = useState(null);

  const { id, post, room } = router.query;

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
          <Container>
            <Paper style={{ padding: '2rem' }}>
              <ReactMarkdownWithHtml
                source={postData.description}
                allowDangerousHtml
                renderers={renderers}
              />
            </Paper>
          </Container>
        </Container>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default Post;
