import {
  makeStyles,
  Paper,
  TextField,
  Typography,
  InputLabel,
  IconButton,
  InputAdornment,
  Button,
  useTheme,
} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../lib/auth';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  title: { padding: theme.spacing(2), fontSize: '2rem' },
  form: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3),
  },
  errorMessage: {
    color: theme.palette.error.main,
  },

  inputs: {
    margin: theme.spacing(1),
  },
}));

const schema = yup.object().shape({
  username: yup.string().min(4).max(15).required(),
  password: yup.string().min(6).max(30).required(),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .when('password', {
      is: (password) => (password && password.length > 0 ? true : false),
      then: yup.string().oneOf([yup.ref('password')], "Password doesn't match"),
    }),
});

const SetPassword = () => {
  const classes = useStyles();
  const auth = useAuth();
  const theme = useTheme();
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [values, setValues] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
  });

  // React Hook Form & Yup Resolver
  const { control, errors, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onSubmit = async (values) => {
    await auth.setUserPassword(values.password).then((response) => {
      enqueueSnackbar('Perfect! Ya tienes password.', { variant: 'default' });
      auth
        .setUsername(values.username)
        .then((response) => {
          enqueueSnackbar(`Los otros te veran como: ${values.username}`, {
            variant: 'default',
          });
          router.push('/');
        })
        .catch((err) => {
          enqueueSnackbar(`Wepa lo jodiste de alguna manera - vamos a ver...`, {
            variant: 'error',
          });
          enqueueSnackbar(`ERROR: ${err}`, { variant: 'error' });
        });
    });
  };

  useEffect(() => {
    if (auth.userData) {
      router.push('/');
    }
  }, [auth.userData]);

  return (
    <div className={classes.root}>
      <Paper className={classes.formPaper}>
        <Typography className={classes.title} align='center' variant='h3'>
          Crea un{' '}
          <span style={{ color: theme.palette.primary.main }}>Username</span> y
          un <span style={{ color: theme.palette.primary.main }}>Password</span>
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            defaultValue=''
            name='username'
            render={(props) => (
              <TextField
                {...props}
                className={classes.inputs}
                label='username'
                autoComplete='false'
                variant='outlined'
                type='text'
              />
            )}
          />
          <Typography
            variant='caption'
            className={classes.errorMessage}
            align='left'
          >
            {errors.username?.message.toString()}
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
                        {values.showPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <Typography
            variant='caption'
            className={classes.errorMessage}
            align='left'
          >
            {errors.password?.message.toString()}
          </Typography>
          <Controller
            control={control}
            defaultValue=''
            name='confirmPassword'
            render={(props) => (
              <TextField
                {...props}
                className={classes.inputs}
                label='Confirm Password'
                variant='outlined'
                autoComplete='false'
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
                        {values.showPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <Typography
            variant='caption'
            className={classes.errorMessage}
            align='center'
          >
            {errors.confirmPassword?.message}
          </Typography>
          <Button color='primary' type='submit'>
            Vamo'alla
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default SetPassword;
