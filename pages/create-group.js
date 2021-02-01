import {
  Button,
  Container,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import useGroups from '../lib/useGroups';
import { useRouter } from 'next/router';
import firebase from '../lib/firebase';
import { useAuth } from '../lib/auth';
import marked from 'marked';

const db = firebase.firestore();

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
}));

const schema = yup.object().shape({
  name: yup.string().min(6).max(30).required(),
  description: yup.string().min(15).max(2000),
  shortDescription: yup.string().min(10).max(100),
});

const CreateGroup = () => {
  const classes = useStyles();
  const router = useRouter();
  const auth = useAuth();

  const [markdownPreview, setMarkdownPreview] = useState('');
  //SNACKBARS
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // FORM SETUP
  const [values, setValues] = useState({
    name: '',
    description: '',
    shortDescription: '',
  });
  const { handleSubmit, control, errors } = useForm({
    resolver: yupResolver(schema),
  });
  const { createGroup, loading } = useGroups();

  const onSubmit = async (values) => {
    await createGroup(values).then(() =>
      router.push('/').catch((err) => {
        console.log(err);
      })
    );
  };

  return (
    <Container align='center' maxWidth='md'>
      {/* <Paper> */}
      <Typography align='center' variant='h3'>
        Crea Un Grupo
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          className={classes.inputs}
          control={control}
          defaultValue=''
          name='name'
          render={(props) => (
            <TextField
              {...props}
              className={classes.inputs}
              label='Nombre del Grupo'
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
          name='shortDescription'
          render={(props) => (
            <TextField
              {...props}
              className={classes.inputs}
              label='Descripcion Corta'
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
              label='Descripcion - [tip: ☕MD Enabled ✌]'
              autoComplete='false'
              variant='outlined'
              fullWidth
              multiline
              type='text'
            />
          )}
        />
        <Typography className={classes.error} variant='body2'>
          {errors.name?.message}
        </Typography>
        <Typography className={classes.error} variant='body2'>
          {errors.description?.message}
        </Typography>
        <Button disabled={loading} type='submit'>
          CREAR
        </Button>
      </form>
      {/* </Paper> */}
    </Container>
  );
};

export default CreateGroup;
