import {
  Button,
  Container,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../lib/auth';
import marked from 'marked';
import firebase from '../../lib/firebase';
import RoomsGrid from '../../components/groups/RoomsGrid';
import { ChevronLeft } from '@material-ui/icons';
import Link from 'next/link';
import useRooms from '../../lib/useRooms';

const db = firebase.firestore();

const useStyles = makeStyles((theme) => ({
  root: { height: '100%', paddingBottom: theme.spacing(2) },
  descriptionMarkdown: {
    padding: theme.spacing(2),
  },
  groupDescriptionSection: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(6),
  },
  backButton: {
    display: 'flex',
    paddingTop: theme.spacing(4),
    alignItems: 'center',
    color: theme.palette.primary.main,
    fontSize: '.5rem',
    cursor: 'pointer',
  },
  descriptionMarkdown: {
    // width: '80vw',
    fontSize: '1reonm',
  },
}));

const GroupDetail = () => {
  const classes = useStyles();
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [editFieldValue, setEditFieldValue] = useState('');
  const auth = useAuth();
  const [groupInfo, setGroupInfo] = useState(null);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);

  const { id } = router.query;

  const { rooms, roomsLoading } = useRooms();

  useEffect(() => {
    console.log('Rooms is ==> ', rooms);
    console.log('Loading is ==>', roomsLoading);
  }, [roomsLoading]);

  useEffect(() => {
    async function getGroupInfo() {
      if (auth.user && !groupInfo) {
        const groupInfo = await db
          .collection('groups')
          .doc(id)
          .get()
          .then((res) => {
            console.log('Got Group Info!');
            setGroupInfo(res.data());
          })
          .catch((err) => {
            console.log('Error: ', err);
          });
      }
    }
    async function checkAccess() {
      if (auth.userData && groupInfo?.members) {
        let members = groupInfo?.members ?? [];

        if (!members.includes(auth.userData.email)) {
          console.log('got false');
          setLoading(false);
          enqueueSnackbar(`Tu no tienes acceso a este grupo.`, {
            variant: 'warning',
          });
          router.push('/');
          return;
        }
        setLoading(false);
      }
    }

    getGroupInfo();
    checkAccess();
  }, [auth.userData, groupInfo]);

  useEffect(() => {
    if (groupInfo && groupInfo?.description) {
      setEditFieldValue(groupInfo.description);
    }
  }, [groupInfo]);

  const handleEditChange = (e) => {
    setEditFieldValue(e.target.value);
  };

  const handleSaveEdit = () => {
    if (auth.user.uid === groupInfo.author) {
      db.collection('groups')
        .doc(groupInfo.slug)
        .set({ description: editFieldValue }, { merge: true })
        .then(() => {
          enqueueSnackbar(`Nice - Cambiaste el la descripcion de tu grupo`, {
            variant: 'success',
          });
          router.reload();
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar(`Diache algo paso...`, { variant: 'error' });
          enqueueSnackbar(`${err}`, { variant: 'error' });
        });
    }
  };

  const isOwner = () => {
    if (auth.user.uid === groupInfo.author) {
      return true;
    }

    return false;
  };

  return (
    <>
      {loading && (
        <Typography variant='h3' color='primary' align='center'>
          Fetching Group...
        </Typography>
      )}
      {!loading && (
        <Container className={classes.root} maxWidth='md'>
          <Typography
            style={{ paddingTop: '1rem' }}
            align='center'
            color='primary'
            variant='h3'
          >
            {groupInfo?.name}
          </Typography>
          <div onClick={() => router.back()} className={classes.backButton}>
            <ChevronLeft />
            <Typography style={{ fontSize: '1rem' }}>P'atras</Typography>
          </div>

          {rooms && <RoomsGrid rooms={rooms} />}
          {isOwner() && (
            <Container align='center'>
              <Button
                onClick={() =>
                  router.push(`/groups/${groupInfo.slug}/create-room`)
                }
              >
                Crear Cuarto
              </Button>
            </Container>
          )}

          <Paper elevation={4} className={classes.groupDescriptionSection}>
            <Typography align='center' color='primary' variant='h3'>
              Descripcion de Grupo
            </Typography>
            {isOwner() && (
              <Container align='right'>
                <Button
                  onClick={() => setEditMode(!editMode)}
                  color='primary'
                  variant='outlined'
                >
                  {editMode ? 'Volver' : 'Edit'}
                </Button>
              </Container>
            )}

            {!editMode ? (
              <div
                className={classes.descriptionMarkdown}
                dangerouslySetInnerHTML={{
                  __html: marked(groupInfo.description),
                }}
              ></div>
            ) : (
              <>
                <TextField
                  fullWidth
                  variant='outlined'
                  multiline
                  value={editFieldValue}
                  onChange={handleEditChange}
                />

                <Container align='right'>
                  <Button onClick={handleSaveEdit} color='primary'>
                    Guardar
                  </Button>
                </Container>
              </>
            )}
          </Paper>
        </Container>
      )}
    </>
  );
};

export default GroupDetail;
