import React, { useEffect, useState } from 'react';
import { makeStyles, Typography, Paper, TextField, Button } from '@material-ui/core';
import { useAuth } from '../../lib/auth';
import clsx from 'clsx';
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
    width: '50%',
    [theme.breakpoints.down('sm')]: {
      width: '90%',
    },
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
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    margin: theme.spacing(1),
  },
  button: {
    marginTop: theme.spacing(4),
  },
  prefPassword: {
    color: theme.palette.primary.main,
    marginTop: theme.spacing(2),
    cursor: 'pointer',
  },
}));

const schema = yup.object().shape({
  email: yup.string().email().required(),
});

const EmailLogin = ({ auth, usePassword, setUsePassword }) => {
  const classes = useStyles();
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
    const email = values.email.trim().toLowerCase();
    if (!emailSent) {
      auth.emailLinkAuth(values.email).then((res) => {
        if (res) {
          console.log('res is => ', res);
          enqueueSnackbar(`Por ahi se fue! Verifica el Inbox de: ${values.email}`, {
            variant: 'success',
          });
          setEmailSent(true);
        }
      });
    } else {
      enqueueSnackbar(
        `Ya te enviamos un email - verifica el inbox y si no dale refresh a esta pagina.`,
        {
          variant: 'warning',
        }
      );
    }
  };

  return (
    <Paper className={classes.loginPaper}>
      <Typography className={classes.title} align='center' variant='h3'>
        Magic Link Signin
      </Typography>
      <Typography className={classes.subtitle}>
        Crea tu cuenta si no tienes una, pero tambien puedes login de esta manera si ya
        tienes cuenta. A fuego 🔥.
      </Typography>

      <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
        {/* <Controller
          as={TextField}
          defaultValue=''
          variant='outlined'
          id='email-input'
          label='email'
          name='email'
          control={control}
          className={classes.inputs}
        /> */}
        <Typography className={classes.error} variant='body2'>
          {errors.email?.message}
        </Typography>
        <Button
          className={classes.button}
          type='submit'
          disabled={auth.loading}
          color={emailSent ? 'secondary' : 'primary'}
        >
          {emailSent ? 'Chequea tu Inbox!' : "Vamo'alla!"}
        </Button>

        <Typography
          onClick={() => setUsePassword(true)}
          align='center'
          className={classes.prefPassword}
        >
          😅 cul - pero <span style={{ fontWeight: 'bold' }}>prefiero password </span>🙃🙈
        </Typography>
      </form>
    </Paper>
  );
};

export default EmailLogin;
