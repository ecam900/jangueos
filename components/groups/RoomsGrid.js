import { Grid, makeStyles, Typography } from '@material-ui/core';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { listVariants, listItemVariants } from './animationVariants';
import RoomItem from './RoomItem';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}));

const RoomsGrid = ({ rooms }) => {
  const classes = useStyles();
  const router = useRouter();

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        {rooms &&
          rooms.map((room, i) => {
            return (
              <Grid
                item
                key={i}
                xs={12}
                sm={4}
                onClick={() => router.push(`${router.asPath}/${room.slug}`)}
              >
                <motion.div
                  variants={listItemVariants}
                  initial='hidden'
                  animate='visible'
                >
                  <RoomItem room={room} />
                </motion.div>
              </Grid>
            );
          })}
      </Grid>
      {!rooms && (
        <Typography variant='subtitl2'>
          😕 No Hay Ningun Cuarto... toma una galleta 🍪.
        </Typography>
      )}
    </div>
  );
};

export default RoomsGrid;
