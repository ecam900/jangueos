import { Grid, makeStyles, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import useRooms from '../../lib/useRooms';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}));

const RoomsGrid = ({ rooms }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item>
          <Typography>Grid Item</Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default RoomsGrid;
