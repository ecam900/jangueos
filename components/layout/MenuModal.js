import { ClickAwayListener, makeStyles, Typography } from '@material-ui/core';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    zIndex: '2',
    // height: '20vh',
    // width: '50vw',
    backgroundColor: theme.palette.background.paper,
    top: '6%',
    right: '5%',
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
}));

const MenuModal = ({ signOut, open, setOpen }) => {
  const classes = useStyles(open);

  const handleClickAway = () => {
    setOpen(false);
  };

  return (
    <>
      {open && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className={classes.root}
            key='logout'
          >
            <Typography onClick={() => signOut()} variant='h4'>
              Log Out
            </Typography>
          </motion.div>
        </ClickAwayListener>
      )}
    </>
  );
};

export default MenuModal;
