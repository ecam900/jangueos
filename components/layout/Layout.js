import { Button, Container, makeStyles, Typography } from '@material-ui/core';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/auth';
import layoutVariants from './layoutVariants';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflowX: 'hidden',
  },
  topNav: {
    minHeight: '10vh',
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  childrenWrapper: {
    flexGrow: '1',
    // overflowX: 'hidden',
  },
  footer: {
    flexShrink: 0,
    minHeight: '10vh',
    backgroundColor: theme.palette.background.default,
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    cursor: 'pointer',
  },
}));

const Layout = ({ children }) => {
  const classes = useStyles();
  const auth = useAuth();
  const router = useRouter();

  return (
    <div className={classes.root}>
      <Container maxWidth='lg'>
        <div className={classes.topNav}>
          <div className={classes.logo}>
            <Link href='/'>
              <Typography variant='h3'>dimelo</Typography>
            </Link>
          </div>
          {auth.user && (
            <Button onClick={() => auth.signOut()} size='small' color='primary'>
              LOG OUT
            </Button>
          )}
        </div>
      </Container>
      <div className={classes.childrenWrapper}>
        <AnimatePresence exitBeforeEnter>
          <motion.div
            style={{ height: '100%' }}
            variants={layoutVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            key={router.route}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className={classes.footer}>
        <Typography style={{ width: '100%' }} align='center' variant='caption'>
          copyright © jangueo {new Date().getFullYear()}
        </Typography>
      </div>
    </div>
  );
};

export default Layout;
