import {
  Container,
  Divider,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Link from 'next/link';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },

  title: {
    paddingBottom: theme.spacing(1),
  },
  cardPaper: {
    padding: theme.spacing(2),
    cursor: 'pointer',
  },
  author: {
    color: theme.palette.grey[500],
    flexShrink: 0,
    fontSize: '1rem',
  },
}));

const GroupItem = ({ groupname, description, author, slug }) => {
  const classes = useStyles();
  const router = useRouter();

  return (
    <div className={classes.root}>
      <Container align='left' maxWidth='md'>
        <motion.div whileTap={{ scale: 0.95 }}>
          <Link href={`/groups/${slug}`} passHref>
            <Paper className={classes.cardPaper}>
              <Typography
                color='primary'
                className={classes.title}
                variant='h3'
              >
                {groupname}
              </Typography>
              <Typography>{description}</Typography>
              <Typography
                className={classes.author}
                align='right'
                variant='subtitle1'
              >
                author: {author}
              </Typography>
            </Paper>
          </Link>
        </motion.div>
      </Container>
    </div>
  );
};

export default GroupItem;
