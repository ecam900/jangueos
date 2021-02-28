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
    <motion.div
      variants={listVariants}
      initial='hidden'
      animate='visible'
      className={classes.root}
    >
      <Grid container spacing={2}>
        {rooms &&
          rooms.map((room, i) => {
            return (
              <Grid
                item
                key={i}
                xs={12}
                sm={6}
                onClick={() => router.push(`${router.asPath}/${room.slug}`)}
              >
                <motion.div
                  key={i}
                  variants={listItemVariants}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  // initial='hidden'
                  // animate='visible'
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
    </motion.div>
  );
};

export default RoomsGrid;
