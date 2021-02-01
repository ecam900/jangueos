import {
  Button,
  Container,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth';
import marked from 'marked';
import firebase from '../../lib/firebase';
import ChannelsGrid from '../../components/groups/ChannelsGrid';

const db = firebase.firestore();

const useStyles = makeStyles((theme) => ({
  root: { height: '100%' },
  descriptionMarkdown: {
    padding: theme.spacing(2),
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

  useEffect(() => {
    console.log;
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

          <ChannelsGrid />

          <Container align='center'>
            <Button>Crear Canal</Button>
          </Container>

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
        </Container>
      )}
    </>
  );
};

export default GroupDetail;
