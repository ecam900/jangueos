import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  Typography,
  Paper,
  TextField,
  Button,
} from '@material-ui/core';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/auth';
import EmailLogin from '../components/login/EmailLogin';
import PasswordLogin from '../components/login/PasswordLogin';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    overflow: 'hidden',
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

const Login = () => {
  const classes = useStyles();
  const auth = useAuth();
  const router = useRouter();
  const [usePassword, setUsePassword] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const loginvariants = {
    hidden: {
      opacity: 0,
      x: -100,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      x: 100,
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const handleEmailAndPasswordLogin = async (email, password) => {
    const sanitizedEmail = email.toLowerCase();
    await auth
      .passwordLogin(sanitizedEmail, password)
      .then((response) => {
        if (response.user) {
          enqueueSnackbar(`Wepa - estas logged in.`, {
            variant: 'success',
          });
        } else {
          enqueueSnackbar(
            'O metiste la pata..o meti la pata. Trata de nuevo plis.',
            { variant: 'error' }
          );
        }
      })
      .catch((err) => {
        enqueueSnackbar(
          'O metiste la pata..o meti la pata. Trata de nuevo plis.',
          { variant: 'error' }
        );
        enqueueSnackbar(`${err}`, { variant: 'error' });
      });
  };

  useEffect(() => {
    console.log('Detected user: Pushing to Home');
    auth.user && router.push('/');
  }, [auth.user]);

  return (
    <div className={classes.root}>
      <AnimatePresence exitBeforeEnter>
        {usePassword ? (
          <motion.div
            key='password'
            variants={loginvariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
          >
            <PasswordLogin
              usePassword={usePassword}
              setUsePassword={setUsePassword}
              handleEmailAndPasswordLogin={handleEmailAndPasswordLogin}
              auth={auth}
            />
          </motion.div>
        ) : (
          <motion.div
            key='email'
            variants={loginvariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
          >
            <EmailLogin
              usePassword={usePassword}
              setUsePassword={setUsePassword}
              handleEmailAndPasswordLogin={handleEmailAndPasswordLogin}
              auth={auth}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
