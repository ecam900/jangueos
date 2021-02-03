import { Grid, makeStyles, Typography } from '@material-ui/core';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

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
        <motion.div>
          {rooms &&
            rooms.map((room, i) => {
              return (
                <motion.div key={i}>
                  <Grid item>
                    <Typography>{room.name}</Typography>
                  </Grid>
                </motion.div>
              );
            })}
        </motion.div>
      </Grid>
    </div>
  );
};

export default RoomsGrid;
