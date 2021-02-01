import { Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'red',
    padding: theme.spacing(2),
  },
}));

const ChannelsGrid = () => {
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

export default ChannelsGrid;
