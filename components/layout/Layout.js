import {
  Button,
  ClickAwayListener,
  Container,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import {
  AnimatePresence,
  motion,
  useAnimation,
  useElementScroll,
  useViewportScroll,
} from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../lib/auth';
import HamburgerMenu from '../HamburgerMenu';
import layoutVariants from './layoutVariants';
import MenuModal from './MenuModal';
import { navbarVariants } from './navbarVariants';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100%',
    overflowX: 'hidden',
    position: 'relative',
  },
  topNavContainer: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    zIndex: 1,
  },
  topNav: {
    padding: theme.spacing(1),
    minHeight: '5vh',
    color: theme.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing(6),
      paddingRight: theme.spacing(6),
    },
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

  hamburger: {
    [theme.breakpoints.up('md')]: {
      width: '5%',
    },
    width: '10%',
    color: theme.palette.primary.main,
    cursor: 'pointer',
  },
}));

const Layout = ({ children }) => {
  const classes = useStyles();
  const auth = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const controls = useAnimation();

  //Navbar Scroll Tracking for Hiding it on Scroll Up
  const { scrollY } = useViewportScroll();

  // True is down.
  const [scrollDirection, setScrollDirection] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [beyondThreshold, setBeyondThreshold] = useState(false);

  // Menu Modal State
  const [open, setOpen] = useState(false);

  const { signOut } = auth;

  useEffect(() => {
    async function updateScroll() {
      const scrollVelocity = scrollY.getVelocity();
      const scrollPosition = scrollY.get();

      if (scrollVelocity > 0) {
        // console.log('positive. scrolling DOWN.');
        setScrollDirection(true);
      }

      if (scrollVelocity < 0) {
        // console.log('negative. scrolling UP.');
        setScrollDirection(false);
      }

      setScrollPosition(scrollPosition);
      // console.log('Scroll position is ==> ', scrollPosition);
    }

    const unsubscribeScrollY = scrollY.onChange(updateScroll);

    return () => unsubscribeScrollY();
  }, []);

  useEffect(() => {
    if (beyondThreshold && scrollDirection) {
      // console.log('Scrolling down beyond threshhold!');
      controls.start('hidden');
    }

    if (!beyondThreshold || !scrollDirection) {
      // console.log('Scrolling up!');
      controls.start('visible');
    }
  }, [scrollDirection, beyondThreshold]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (scrollPosition > 200) {
        setBeyondThreshold(true);
      }
      if (scrollPosition < 200) {
        setBeyondThreshold(false);
      }
    }, 100);

    return () => clearTimeout(handler);
  }),
    [scrollPosition];

  return (
    <div className={classes.root}>
      <motion.div
        className={classes.topNavContainer}
        animate={controls}
        variants={navbarVariants}
      >
        <Container maxWidth={'lg'} className={classes.topNav}>
          <div className={classes.logo}>
            <Link href='/'>
              <Typography variant='h1' style={{ fontSize: '2rem' }}>
                dimelo
              </Typography>
            </Link>
          </div>
          {/* {auth.user && !isMobile && (
            <Button onClick={() => signOut()} size='small' color='primary'>
              LOG OUT
            </Button>
          )} */}

          {auth.user && (
            <motion.div
              whileTap={{ scale: 0.8 }}
              onClick={() => setOpen(!open)}
              className={classes.hamburger}
            >
              <HamburgerMenu />
            </motion.div>
          )}
        </Container>
      </motion.div>

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
          copyright © dimelo {new Date().getFullYear()}
        </Typography>
      </div>

      <MenuModal open={open} signOut={signOut} setOpen={setOpen} />
    </div>
  );
};

export default Layout;
