import {
  Button,
  ClickAwayListener,
  Container,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import { ChevronLeft } from '@material-ui/icons';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';

const modalVariants = {
  hidden: {
    x: -200,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 1,
    },
    exit: {
      x: -200,
      opacity: 0,
    },
  },
};

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    // zIndex: '1',
    borderRadius: '8px',
    '& .MuiContainer-root': {
      height: '100%',
      width: '100%',
    },
    '& .MuiPaper-root': {
      height: '100%',
      width: '100%',
    },
    '& .MuiTypography-h3': {
      padding: theme.spacing(2),
    },
    padding: theme.spacing(2),
  },
  backButton: {
    cursor: 'pointer',
    display: 'flex',
    padding: theme.spacing(2),
  },
  form: {
    padding: theme.spacing(2),
  },
  inputs: {
    paddingBottom: theme.spacing(2),
  },
}));

const schema = yup.object().shape({
  groupID: yup.string().matches('/^[a-zA-Z0-9-_]+$/').required(),
  pin: yup.string().required(),
});

const JoinGroupModal = ({ open, setOpen }) => {
  const classes = useStyles();
  const router = useRouter();

  // Form State
  const [values, setvalues] = useState({
    groupID: '',
    pin: '',
  });

  // React Hook Form
  const { handleSubmit, control, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const handleClickBack = () => {
    console.log('baaack!');
    setOpen(false);
  };

  const onSubmit = (values) => {
    console.log('SUBMIT CLICKED', values);
  };

  return (
    <motion.div
      variants={modalVariants}
      initial={{ opacity: 0, x: -500 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 500 }}
      className={classes.root}
    >
      <ClickAwayListener onClickAway={handleClickBack}>
        <Container maxWidth='md'>
          <Paper>
            <div onClick={handleClickBack} className={classes.backButton}>
              <ChevronLeft />
              <Typography style={{ fontSize: '1rem' }}>P'atras</Typography>
            </div>
            <Typography align='center' variant='h3'>
              Unete A Un Grupo
            </Typography>
            <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
              <Controller
                // className={classes.inputs}
                control={control}
                defaultValue=''
                name='GroupID'
                render={(props) => (
                  <TextField
                    {...props}
                    className={classes.inputs}
                    label='Entra el GroupID'
                    autoComplete='false'
                    variant='outlined'
                    fullWidth
                    type='text'
                  />
                )}
              />
              <Controller
                // className={classes.inputs}
                control={control}
                defaultValue=''
                name='pin'
                render={(props) => (
                  <TextField
                    {...props}
                    className={classes.inputs}
                    label='Entra El Pin'
                    autoComplete='false'
                    variant='outlined'
                    fullWidth
                    type='text'
                  />
                )}
              />

              <Typography className={classes.error} variant='body2'>
                {errors.groupID?.message}
              </Typography>
              <Typography className={classes.error} variant='body2'>
                {errors.pin?.message}
              </Typography>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  justifyContent: 'center',
                }}
              >
                <Button align='center' type='submit'>
                  ENTRAR
                </Button>
              </div>
            </form>
          </Paper>
        </Container>
      </ClickAwayListener>
    </motion.div>
  );
};

export default JoinGroupModal;
