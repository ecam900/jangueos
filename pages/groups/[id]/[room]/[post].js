import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: { minHeight: '110vh' },
}));

const Post = () => {
  const classes = useStyles();

  return <div className={classes.root}>This is post</div>;
};

export default Post;
