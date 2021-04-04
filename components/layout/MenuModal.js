import {
  Button,
  ClickAwayListener,
  Container,
  IconButton,
  makeStyles,
  Switch,
  Typography,
} from '@material-ui/core';
import { CancelTwoTone } from '@material-ui/icons';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useContext, useEffect, useState } from 'react';
import { CustomThemeContext } from 'styles/themes/CustomThemeProvider';
import NotificationsPanel from './NotificationsPanel';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    zIndex: 5,
    height: '100vh',
    width: '100vw',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '8px',
    display: (open) => (open ? 'flex' : 'none'),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    '& .MuiTypography-root': {
      padding: theme.spacing(2),
      cursor: 'pointer',
    },
  },

  notificationsArea: {
    width: '100%',
    maxHeight: '70vh',
    overflow: 'hidden',
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      width: '0',
    },
    '&::-webkit-scrollbar-track': {
      display: 'none',
    },
    '&::-webkit-scrollbar-thumb': {
      display: 'none',
    },
  },

  actionsArea: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingPane: {
    height: '100vh',
    width: '100vw',
    zIndex: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.primary.main,
  },
  topBar: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  backButton: {
    fontSize: '2rem',
  },
}));

const MenuModal = ({ signOut, open, setOpen, auth, router }) => {
  const classes = useStyles(open);
  const { currentTheme, setTheme } = useContext(CustomThemeContext);
  const [darkToggle, setDarkToggle] = useState(false);

  // const handleThemeChange = (e) => {
  //   // const { checked } = e.target;
  //   if (checked) {
  //     setTheme('darkTheme');
  //   } else {
  //     setTheme('lightTheme');
  //   }
  // };

  const handleToggle = () => {
    if (currentTheme === 'darkTheme') {
      setTheme('lightTheme');
    } else {
      setTheme('darkTheme');
    }
  };

  useEffect(() => {
    if (currentTheme === 'darkTheme') {
      setDarkToggle(true);
    } else {
      setDarkToggle(false);
    }
  }, [currentTheme]);

  return (
    <>
      {auth.loading || !auth.userData ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={classes.loadingPane}
          key='loading'
        >
          <Typography>'Perate</Typography>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={classes.root}
          key='modal'
        >
          <Container className={classes.notificationsArea}>
            <motion.div className={classes.topBar}>
              <IconButton style={{ paddingBottom: 0 }} onClick={() => setOpen(false)}>
                <CancelTwoTone className={classes.backButton} color='primary' />
              </IconButton>
            </motion.div>
            <NotificationsPanel setOpen={setOpen} open={open} auth={auth} />
          </Container>
          <Container align='center' className={classes.actionsArea}>
            <Button style={{ maxWidth: '200px' }} onClick={() => auth.signOut()}>
              LOGOUT
            </Button>
            <div>
              <Typography variant='body2' color='primary' style={{ fontWeight: 'bold' }}>
                Dark Mode
              </Typography>
              <Switch checked={darkToggle} onClick={handleToggle} />
            </div>
          </Container>
        </motion.div>
      )}
    </>
  );
};

export default MenuModal;
