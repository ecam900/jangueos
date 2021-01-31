import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  Typography,
  Paper,
  TextField,
  Button,
} from '@material-ui/core';
import { useAuth } from '../lib/auth';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
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
  loginPaper: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(6),
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    margin: theme.spacing(1),
  },
}));

const schema = yup.object().shape({
  email: yup.string().email().required(),
});

const Login = () => {
  const classes = useStyles();
  const auth = useAuth();
  const router = useRouter();
  const [values, setValues] = useState({
    email: '',
  });

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [emailSent, setEmailSent] = useState(false);
  const { handleSubmit, control, errors } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    console.log('Detected user: Pushing to Home');
    auth.user && router.push('/');
  }, [auth.user]);

  const onSubmit = (values) => {
    if (!emailSent) {
      auth.emailLinkAuth(values.email).then((res) => {
        if (res) {
          console.log('res is true');
          enqueueSnackbar(
            `Por ahi se fue! Verifica el Inbox de: ${values.email}`,
            {
              variant: 'success',
            }
          );
          setEmailSent(true);
        }
      });
    } else {
      enqueueSnackbar(`No no no asi no se puede...`, {
        variant: 'warning',
      });
      enqueueSnackbar(
        `Ya te enviamos un email - verifica el inbox y si no dale refresh a esta pagina.`,
        {
          variant: 'warning',
        }
      );
    }
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.loginPaper}>
        <Typography
          style={{ marginBottom: '1rem', fontSize: '2rem' }}
          variant='h3'
        >
          Por Favor Entre Su Email
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
          <Button type='submit' disabled={auth.loading} color='primary'>
            {emailSent ? 'Chequea tu Inbox!' : "Vamo'alla!"}
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default Login;
