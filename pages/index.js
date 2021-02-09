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
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../lib/auth';
import Link from 'next/link';
import layoutVariants from '../components/layout/layoutVariants';
import { useRouter } from 'next/router';
import GroupList from '../components/home/GroupList';
import useGroups from '../lib/useGroups';
import { useEffect, useState } from 'react';
import JoinGroupModal from '../components/JoinGroupModal';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    justifyItems: 'center',
    position: 'relative',
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
  const [open, setOpen] = useState(false);

  return (
    <div className={classes.root}>
      <div className={classes.groupsSection}>
        <Container align='center' maxWidth='md'>
          <GroupList open={open} setOpen={setOpen} />
        </Container>
      </div>
      <AnimatePresence exitBeforeEnter>
        {open && <JoinGroupModal key='modal' open={open} setOpen={setOpen} />}
      </AnimatePresence>
    </div>
  );
}
