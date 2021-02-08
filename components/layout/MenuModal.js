import { makeStyles, Typography } from '@material-ui/core';
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

const MenuModal = ({ signOut, open }) => {
  const classes = useStyles(open);

  return (
    <div className={classes.root}>
      <Typography onClick={() => signOut()} variant='h4'>
        Log Out
      </Typography>
    </div>
  );
};

export default MenuModal;
