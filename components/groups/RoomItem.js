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
    width: '80%',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    '& .MuiTypography-h5': {
      fontWeight: 'bold',
      opacity: 0.8,
    },
    '& .MuiTypography-body1': {
      padding: theme.spacing(2),
      paddingTop: 'none',
    },
    borderRadius: '15px',
  },

  paper: {
    background:
      theme.palette.type === 'dark' ? 'none' : `rgba(255,255,255, 0.8)`,
    borderRadius: '15px',
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
      <Paper elevation={5} className={classes.paper}>
        <div className={classes.itemHeader}>
          <Typography noWrap align={isMobile ? 'center' : 'left'} variant='h5'>
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
