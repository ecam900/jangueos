import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  Typography,
  Paper,
  TextField,
  Button,
  InputLabel,
  IconButton,
  InputAdornment,
} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/auth';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  title: {
    marginBottom: theme.spacing(1),
    color: theme.palette.primary.main,
  },
  subtitle: {
    margin: theme.spacing(1),
    marginBottom: theme.spacing(2),
    color: theme.palette.grey[600],
  },
  loginPaper: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(6),
    width: '50%',
    [theme.breakpoints.down('sm')]: {
      width: '90%',
    },
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputs: {
    margin: theme.spacing(1),
  },
  prefPassword: {
    color: theme.palette.primary.main,
    marginTop: theme.spacing(2),
    cursor: 'pointer',
  },
}));

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const PasswordLogin = ({
  auth,
  handleEmailAndPasswordLogin,
  setUsePassword,
  usePassword,
}) => {
  const classes = useStyles();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    email: '',
    password: '',
    showPassword: false,
  });

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { handleSubmit, control, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onSubmit = async (values) => {
    await handleEmailAndPasswordLogin(values.email, values.password)
      .then((res) => {
        console.log('RES ==> ', res);
      })
      .catch((err) => {
        console.log('ERROR: ', err);
        enqueueSnackbar(
          'O metiste la pata..o meti la pata. Trata de nuevo plis.',
          { variant: 'error' }
        );
      });
  };

  return (
    <Paper className={classes.loginPaper}>
      <Typography className={classes.title} align='center' variant='h3'>
        Password Signin
      </Typography>
      <Typography align='center' className={classes.subtitle}>
        Clasico pero si funciona, pa que cambiarlo? A agua 🌊.
      </Typography>
      <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
        <Controller
          as={TextField}
          defaultValue=''
          variant='outlined'
          id='email-input'
          label='email'
          name='email'
          control={control}
          className={classes.inputs}
        />
        <Typography className={classes.error} variant='body2'>
          {errors.email?.message}
        </Typography>
        <Controller
          control={control}
          defaultValue=''
          name='password'
          render={(props) => (
            <TextField
              {...props}
              className={classes.inputs}
              label='password'
              autoComplete='false'
              variant='outlined'
              type={values.showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge='end'
                    >
                      {values.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        <Typography className={classes.error} variant='body2'>
          {errors.password?.message.toString()}
        </Typography>

        <Button type='submit' disabled={loading} color='primary'>
          {loading ? "'perate..." : "Vamoa'lla"}
        </Button>

        <Typography
          onClick={() => setUsePassword(false)}
          align='center'
          className={classes.prefPassword}
        >
          😤 No me gustan los passwords{' '}
          <span style={{ fontWeight: 'bold' }}>O Se Me Olvido</span>🙃🙈
        </Typography>
      </form>
    </Paper>
  );
};

export default PasswordLogin;
