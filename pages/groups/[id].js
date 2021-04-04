import {
  Button,
  Container,
  makeStyles,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../lib/auth';
import marked from 'marked';
import firebase from '../../lib/firebase';
import RoomsGrid from '../../components/groups/RoomsGrid';
import { ChevronLeft } from '@material-ui/icons';
import Link from 'next/link';
import useRooms from '../../lib/useRooms';

const db = firebase.firestore();

const useStyles = makeStyles((theme) => ({
  svgBGroot: {
    height: '100%',
    minHeight: '100vh',
    paddingTop: '10vh',
    width: '100%',
    // background: `url('/dunebg.svg') no-repeat 0 0 fixed`,
    backgroundSize: 'cover',
    // backgroundColor: 'red',
  },
  root: {
    height: '100% ',
    paddingBottom: theme.spacing(2),
  },
  descriptionMarkdown: {
    padding: theme.spacing(2),
  },
  groupDescriptionSection: {
    padding: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(6),
    },
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
    color: theme.palette.text.primary,
    opacity: 0.85,
    fontSize: '1rem',
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

  // Media Queries and Theme
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  //State for Access Code Modal
  const [isOpen, setIsOpen] = useState(false);

  const { id } = router.query;

  const { rooms, roomsLoading } = useRooms();
  useEffect(() => {
    // console.log('Rooms is ==> ', rooms);
    // console.log('Loading is ==>', roomsLoading);
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

        if (!members.includes(auth.user.uid)) {
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
      <motion.div
        className={classes.svgBGroot}
        animate={{ opacity: 1, transition: { delay: 0.5, duration: 0.5 } }}
        initial={{ opacity: 0 }}
      >
        <AnimatePresence exitBeforeEnter>
          {loading && (
            <motion.div exit={{ opacity: 0 }}>
              <Typography variant='h3' color='primary' align='center'>
                Fetching Group...
              </Typography>
            </motion.div>
          )}
          {!loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Container className={classes.root} maxWidth='md'>
                <Typography
                  style={{
                    paddingTop: '1rem',
                    // color: 'white',
                    fontWeight: 'bold',
                    opacity: 0.8,
                  }}
                  align='center'
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
                      onClick={() => router.push(`/groups/${groupInfo.slug}/create-room`)}
                    >
                      Crear Cuarto
                    </Button>
                  </Container>
                )}

                <Paper elevation={4} className={classes.groupDescriptionSection}>
                  <Typography align='center' variant='h4' style={{ opacity: 0.9 }}>
                    Descripcion de Grupo
                  </Typography>
                  <Container align='right'>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: isOwner() ? 'space-between' : 'center',
                      }}
                    >
                      <Button
                        onClick={() => setIsOpen(!isOpen)}
                        color='primary'
                        variant='outlined'
                        size='small'
                      >
                        ACCESS CODE
                      </Button>
                      {isOwner() && (
                        <Button
                          onClick={() => setEditMode(!editMode)}
                          color='primary'
                          variant='outlined'
                        >
                          {editMode ? 'VOLVER' : 'EDITAR'}
                        </Button>
                      )}
                    </div>
                  </Container>

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
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence exitBeforeEnter>
          {groupInfo && (
            <GroupAccessCodeModal
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              accessCode={groupInfo?.groupCode}
              groupID={groupInfo?.slug}
              key={'groupAccessModal'}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

const GroupAccessCodeModal = ({ isOpen, setIsOpen, accessCode, groupID }) => {
  useEffect(() => {
    const close = (e) => {
      if (e.keyCode === 27) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', close);

    return () => window.removeEventListener('keydown', close);
  }, []);
  return (
    <>
      {isOpen && (
        <motion.div
          style={{
            position: 'fixed',
            left: '0%',
            top: '0%',
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: `rgba(46, 49, 49, .5)`,
          }}
          initial={{ x: -500, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 500, opacity: 0 }}
        >
          <Container maxWidth='md'>
            <Paper
              style={{
                paddingTop: '1rem',
                // minHeight: '40vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography color='primary' variant='h5' align='center'>
                INFORMACION DE ACCESO
              </Typography>
              <Typography align='center' style={{ paddingTop: '1rem' }}>
                Con esta informacion alguien se puede unir al grupo 🗝️.
              </Typography>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  paddingTop: '1rem',
                }}
              >
                <Typography>
                  <span style={{ fontWeight: 'bold' }}>GROUP ID</span>: {groupID}
                </Typography>
                <Typography>
                  <span style={{ fontWeight: 'bold' }}>ACCESS CODE:</span> {accessCode}
                </Typography>
                <Button onClick={() => setIsOpen(false)}>OK DALE</Button>
              </div>
            </Paper>
          </Container>
        </motion.div>
      )}
    </>
  );
};

export default GroupDetail;
