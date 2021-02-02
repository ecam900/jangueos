import {
  makeStyles,
  Paper,
  TextField,
  Typography,
  useTheme,
} from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(6),
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'center',
  },
  title: {
    margin: theme.spacing(1),
  },
  input: {
    margin: theme.spacing(1),
  },
  submitButton: {
    cursor: 'pointer',
    marginTop: theme.spacing(1),
  },
}));

const GroupJoinPane = () => {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <Paper className={classes.root}>
      <Typography align='center' className={classes.title} variant='h3'>
        Entra A Un{' '}
        <span style={{ color: theme.palette.primary.main }}>Grupo</span>
      </Typography>
      <TextField
        className={classes.input}
        variant='outlined'
        placeholder='# de grupo'
      />
      <TextField
        className={classes.input}
        variant='outlined'
        placeholder='password'
      />
      <Typography
        className={classes.submitButton}
        color='primary'
        align='center'
        variant='h5'
      >
        Entrar
      </Typography>
    </Paper>
  );
};

export default GroupJoinPane;
