import { makeStyles, Typography } from '@material-ui/core';
import { ChevronLeft } from '@material-ui/icons';
import { useRouter } from 'next/router';

import React from 'react';

const useStyles = makeStyles((theme) => ({
  backButton: {
    display: 'flex',
    paddingTop: theme.spacing(4),
    alignItems: 'center',
    color: theme.palette.primary.main,
    fontSize: '.5rem',
    cursor: 'pointer',
  },
}));

const BackButton = () => {
  const classes = useStyles();
  return (
    <div className={classes.backButton}>
      <ChevronLeft />
      <Typography style={{ fontSize: '1rem' }}>P'atras</Typography>
    </div>
  );
};

export default BackButton;
