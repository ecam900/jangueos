import { Container, makeStyles, Typography } from '@material-ui/core';
import { motion } from 'framer-motion';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: { width: '100%', display: 'flex', flexDirection: 'column' },
  postItem: {
    backgroundColor: theme.palette.background.paper,
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: '10px',
  },
}));

const PostList = ({ posts }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {posts.length &&
        posts.map((post) => {
          return (
            <motion.div
              key={post.title}
              whileTap={{ scale: 0.96 }}
              initial={{ x: -1000 }}
              animate={{ x: 0 }}
              className={classes.postItem}
            >
              <Container maxWidth='md'>
                <Typography>{post.title}</Typography>
              </Container>
            </motion.div>
          );
        })}
    </div>
  );
};

export default PostList;
