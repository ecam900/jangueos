import {
  Button,
  Container,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { ChevronLeft } from '@material-ui/icons';
import { motion } from 'framer-motion';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    zIndex: 9,
    left: '0%',
    top: '0%',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `rgba(46, 49, 49, .6)`,
  },
  form: { display: 'flex', flexDirection: 'column' },
  inputs: {
    marginTop: theme.spacing(2),
  },

  error: {
    color: theme.palette.secondary.main,
  },
  backButton: {
    display: 'flex',
    paddingTop: theme.spacing(4),
    alignItems: 'center',
    color: theme.palette.primary.main,
    fontSize: '.5rem',
    cursor: 'pointer',
  },
}));

const schema = yup.object().shape({
  description: yup.string().min(1).max(1000),
});

const CreateCommentModal = ({ post, setCreateCommentOpen, loading, createComment }) => {
  const classes = useStyles();
  const router = useRouter();

  //SNACKBARS
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // FORM SETUP
  const [values, setValues] = useState({
    description: '',
  });

  const { handleSubmit, control, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (values) => {
    await createComment(values).then(() => {
      setCreateCommentOpen(false);
    });

    console.log(values);
  };

  useEffect(() => {
    const close = (e) => {
      if (e.keyCode === 27) {
        setCreateCommentOpen(false);
      }
    };

    window.addEventListener('keydown', close);

    return () => window.removeEventListener('keydown', close);
  }, []);
  return (
    <motion.div
      initial={{ x: -1000, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ opacity: 0 }}
      className={classes.root}
    >
      <Container align='center' maxWidth='md'>
        <Paper style={{ padding: '2rem' }}>
          <Typography align='center' variant='h3'>
            Crea Tu Comentario
          </Typography>
          <div onClick={() => setCreateCommentOpen(false)} className={classes.backButton}>
            <ChevronLeft />
            <Typography style={{ fontSize: '1rem' }}>P'atras</Typography>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              className={classes.inputs}
              control={control}
              defaultValue=''
              name='description'
              render={(props) => (
                <TextField
                  {...props}
                  className={classes.inputs}
                  label='⌨️ 🔥Dile ahi...'
                  autoComplete='false'
                  variant='outlined'
                  fullWidth
                  multiline
                  type='text'
                />
              )}
            />

            <Typography className={classes.error} variant='body2'>
              {errors.description?.message}
            </Typography>
            <Button disaabled={loading.toString()} type='submit'>
              {loading ? 'PERATE' : 'CREAR'}
            </Button>
          </form>
        </Paper>
      </Container>
    </motion.div>
  );
};

export default CreateCommentModal;
