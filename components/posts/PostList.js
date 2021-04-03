import { Container, makeStyles, Typography } from '@material-ui/core';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import React from 'react';
import { listVariants, listItemVariants } from './animations';
import PostItem from './PostItem';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  postItem: {
    backgroundColor: theme.palette.background.paper,
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: '10px',
  },
}));

const PostList = ({ posts }) => {
  const router = useRouter();
  const classes = useStyles();
  return (
    <>
      <motion.div
        id='postcontainer'
        initial='hidden'
        animate='visible'
        variants={listVariants}
        className={classes.root}
      >
        {posts.length &&
          posts.map((post) => {
            return (
              <motion.div
                key={post.title}
                whileTap={{ scale: 0.96 }}
                className={classes.postItem}
                variants={listItemVariants}
                onClick={() =>
                  router.push(`${router.asPath}/${post?.postID}`, undefined, {
                    scroll: true,
                  })
                }
              >
                <PostItem post={post} />
              </motion.div>
            );
          })}
      </motion.div>
    </>
  );
};

export default PostList;
