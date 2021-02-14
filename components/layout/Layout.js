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
    // height: '100vh',
    minHeight: '100vh',
    overflowX: 'hidden',
    position: 'relative',
  },
  topNavContainer: {
    position: 'fixed',
    top: '0',
    width: '100%',
    zIndex: 1,
  },
  topNav: {
    paddingTop: theme.spacing(1),
    minHeight: '5vh',
    color: theme.palette.primary.main,
    // backgroundColor: theme.palette.background.default,
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
  const [scrollPosition, setScrollPosition] = useState(0);
  const [lastPosition, setLastPosition] = useState(0);

  // Menu Modal State
  const [open, setOpen] = useState(false);

  const { signOut } = auth;

  useEffect(() => {
    function updateScroll() {
      // if (scrollY.get() < scrollPosition) {
      //   controls.start('hidden');
      // }

      // console.log('Position: ', scrollY.get());

      setScrollPosition(() => scrollY.get());
    }

    const unsubscribeScrollY = scrollY.onChange(updateScroll);

    return () => unsubscribeScrollY();
  }, []);

  // Check for hiding the nav bar if user scrolls down, after threshold distance.
  useEffect(() => {
    function checkPosition() {
      if (scrollPosition <= 150) {
        controls.start('visible');
        return;
      }

      if (lastPosition < scrollPosition) {
        console.log('last position is lesser. you are scrolling down.');
        controls.start('hidden');
      }

      if (lastPosition > scrollPosition) {
        console.log('last position is greater. you are scrolling up.');
        if (lastPosition - scrollPosition > 20) {
          controls.start('visible');
        }
      }
    }

    checkPosition();
    setLastPosition(scrollPosition);
  }, [scrollPosition]);

  return (
    <div className={classes.root}>
      <motion.div animate={controls} variants={navbarVariants}>
        <Container className={classes.topNavContainer} maxWidth='lg'>
          <div className={classes.topNav}>
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
          </div>
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
