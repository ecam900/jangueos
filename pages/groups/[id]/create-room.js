import {
  Button,
  Container,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import useRooms from '../../../lib/useRooms';
import { useRouter } from 'next/router';
import { useAuth } from '../../../lib/auth';
import { ChevronLeft } from '@material-ui/icons';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import { Grid } from '@giphy/react-components';
import GiphyGifs from '../../../components/GiphyGifs';
import SearchExperience from '../../../components/GiphySearchExperience';

// Giphy setup

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
    alignItems: 'center',
    color: theme.palette.primary.main,
    fontSize: '20px',
    cursor: 'pointer',
    marginTop: theme.spacing(2),
  },
}));

const schema = yup.object().shape({
  name: yup.string().min(6).max(30).required(),
  description: yup.string().min(10).max(100),
});

const CreateRoom = () => {
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
  });
  const { handleSubmit, control, errors } = useForm({
    resolver: yupResolver(schema),
  });
  const { createRoom, loading } = useRooms();

  const onSubmit = async (values) => {
    const path = router.asPath;
    const groupID = path.substring(
      path.indexOf('/', 3) + 1,
      path.lastIndexOf('/')
    );

    await createRoom(groupID, values)
      .then(() => {
        console.log('done');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Container align='center' maxWidth='md'>
      {/* <Paper> */}
      <Typography align='center' variant='h3'>
        Crea Un Cuarto
      </Typography>
      <div onClick={() => router.back()} className={classes.backButton}>
        <ChevronLeft />
        <Typography style={{ fontSize: '1.5rem' }}>P'atras</Typography>
      </div>
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
          name='description'
          render={(props) => (
            <TextField
              {...props}
              className={classes.inputs}
              label='Descripcion de Canal 👋'
              autoComplete='false'
              variant='outlined'
              fullWidth
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
      {/* <SearchExperience>
        <GiphyGifs />
      </SearchExperience> */}
    </Container>
  );
};

export default CreateRoom;
