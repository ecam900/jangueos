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
import usePosts from '../../lib/usePosts';
import { ChevronLeft } from '@material-ui/icons';
import { motion } from 'framer-motion';

const useStyles = makeStyles((theme) => ({
  form: { display: 'flex', flexDirection: 'column' },
  inputs: {
    marginTop: theme.spacing(2),
  },
  markdownEditor: {
    padding: theme.spacing(3),
    height: '30vh',
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
  title: yup.string().min(6).max(100).required(),
  description: yup.string().min(15).max(1000),
});

const CreatePost = ({ room, id, setOpenCreate, createPost, loading }) => {
  const classes = useStyles();
  const router = useRouter();

  //SNACKBARS
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // FORM SETUP
  const [values, setValues] = useState({
    title: '',
    description: '',
  });

  const { handleSubmit, control, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (values) => {
    await createPost(id, room, values).then(() => {
      setOpenCreate(false);
    });

    console.log(values);
  };
  return (
    <motion.div
      initial={{ x: -1000, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 1000, opacity: 0 }}
    >
      <Container align='center' maxWidth='lg'>
        <Paper style={{ padding: '2rem' }}>
          <Typography align='center' variant='h3'>
            Crea Tu Post
          </Typography>
          <div
            onClick={() => setOpenCreate(false)}
            className={classes.backButton}
          >
            <ChevronLeft />
            <Typography style={{ fontSize: '1rem' }}>P'atras</Typography>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              className={classes.inputs}
              control={control}
              defaultValue=''
              name='title'
              render={(props) => (
                <TextField
                  {...props}
                  className={classes.inputs}
                  label='Titulo Del Post'
                  autoComplete='false'
                  variant='outlined'
                  fullWidth
                  type='text'
                />
              )}
            />

            <Controller
              className={classes.inputs}
              control={control}
              defaultValue=''
              name='description'
              render={(props) => (
                <TextField
                  {...props}
                  className={classes.inputs}
                  label='Detalles -☕Markdown Enabled ✌'
                  autoComplete='false'
                  variant='outlined'
                  fullWidth
                  multiline
                  type='text'
                />
              )}
            />
            <Typography className={classes.error} variant='body2'>
              {errors.title?.message}
            </Typography>
            <Typography className={classes.error} variant='body2'>
              {errors.description?.message}
            </Typography>
            <Button disabled={loading} type='submit'>
              POSTEAR
            </Button>
          </form>
        </Paper>
        {/* <SearchExperience>
        <GiphyGifs />
      </SearchExperience> */}
      </Container>
    </motion.div>
  );
};

export default CreatePost;
