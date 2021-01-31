import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: '5px',
    padding: theme.spacing(2),
    margin: theme.spacing(1),
    position: 'relative',
    minHeight: '10vh',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  overlay: {
    backgroundColor: theme.palette.primary.main,
    opacity: '.5',
    zIndex: '1',
    height: '10vh',
    position: 'absolute',
  },
  name: {
    fontSize: '1.5rem',
    zIndex: '2',
  },
}));

const Feature = ({ feature }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.overlay} />
      {feature && (
        <div>
          <Typography className={classes.name} variant='h3'>
            {feature.name}
          </Typography>
          <Typography className={classes.description} variant='body1'>
            {feature.description}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default Feature;
