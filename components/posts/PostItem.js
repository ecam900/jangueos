import { makeStyles, Typography, Container } from '@material-ui/core';
import { FavoriteBorder } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: { display: 'flex', flexDirection: 'column' },
  title: {
    fontWeight: 'bold',
  },
  date: {
    color: theme.palette.primary.main,
  },
}));

const PostItem = ({ post }) => {
  const classes = useStyles();

  return (
    <>
      {post && (
        <Container className={classes.root} maxWidth='md'>
          <Typography className={classes.title}>{post.title}</Typography>
          <Typography className={classes.description}>
            {post.description.length > 100
              ? post.description.substr(0, 100) + '...'
              : post.description}
          </Typography>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '.5rem',
              alignItems: 'center',
            }}
          >
            <div>
              <Typography style={{ opacity: 0.7 }}>
                {' '}
                Author: {post?.authorName}
              </Typography>
              <Typography className={classes.date}>
                {post.dateCreated &&
                  post.dateCreated
                    .toDate()
                    .toString()
                    .substr(0, post?.dateCreated?.toDate().toString().indexOf(' ', 12))}
              </Typography>
            </div>

            <div>
              <FavoriteBorder />
            </div>
          </div>
        </Container>
      )}
    </>
  );
};

export default PostItem;
