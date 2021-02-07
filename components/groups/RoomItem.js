import {
  makeStyles,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import DeviceHubIcon from '@material-ui/icons/DeviceHub';
import { motion } from 'framer-motion';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    '& .MuiTypography-h5': {
      fontWeight: 'bold',
      opacity: 0.8,
    },
    '& .MuiTypography-body1': {
      padding: theme.spacing(2),
    },
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& .MuiSvgIcon-root': {},
    padding: theme.spacing(2),
  },
}));

const RoomItem = ({ room }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <motion.div whileTap={{ scale: 0.95 }} className={classes.root}>
      <Paper>
        <div className={classes.itemHeader}>
          <Typography align={isMobile ? 'center' : 'left'} variant='h5'>
            {room.name}
          </Typography>
          <DeviceHubIcon color='primary' />
        </div>
        <Typography align={'left'} variant='body1'>
          {room.description}
        </Typography>
      </Paper>
    </motion.div>
  );
};

export default RoomItem;
