import {
  makeStyles,
  Paper,
  Container,
  Typography,
  Button,
  useTheme,
} from '@material-ui/core';
import Head from 'next/head';
import GroupJoinPane from '../components/GroupJoinPane';
import { motion } from 'framer-motion';
import { useAuth } from '../lib/auth';
import Link from 'next/link';
import layoutVariants from '../components/layout/layoutVariants';
import { useRouter } from 'next/router';
import GroupList from '../components/home/GroupList';
import useGroups from '../lib/useGroups';
import { useEffect, useState } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    justifyItems: 'center',
  },
  groupsSection: {
    height: '100%',
    width: '100%',
  },
  groupsPaper: {
    // width: '50%',
  },
  containerItem: {
    margin: theme.spacing(3),
  },
}));

export default function Home() {
  const classes = useStyles();
  const auth = useAuth();
  const theme = useTheme();
  const router = useRouter();

  // State
  const [groups, setGroups] = useState([]);

  // Hooks
  const { fetchGroups } = useGroups();

  useEffect(() => {
    async function getGroups() {
      let groups = await fetchGroups();
      setGroups(groups);
    }

    if (auth.userData) getGroups();
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.groupsSection}>
        <Container align='center' maxWidth='md'>
          <GroupList groups={groups} />

          {groups.length < 1 && (
            <Typography className={classes.containerItem}>
              No eres miembro de ningun grupo 🙃
            </Typography>
          )}
        </Container>
      </div>
      {/* <GroupJoinPane /> */}
      {/* <GroupJoinPane />
      <GroupJoinPane /> */}
    </div>
  );
}
