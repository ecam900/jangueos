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

const myGroups = [
  {
    author: '1',
    authorDisplay: 'Eric',
    description: 'lalalalala',
    shortDescription: 'lololalaksdjflaksdjfaf',
    name: 'Gargolandia',
    slug: 'bleh',
  },
  {
    author: '2',
    authorDisplay: 'Andres',
    description: 'lalalalala',
    shortDescription: 'lololalaksdjflaksdjfaf',
    name: 'Blehlandia',
    slug: 'gargo',
  },
];

export default function Home() {
  const classes = useStyles();
  const auth = useAuth();
  const theme = useTheme();
  const router = useRouter();

  return (
    <div className={classes.root}>
      <div className={classes.groupsSection}>
        <Container align='center' maxWidth='md'>
          <GroupList />
        </Container>
      </div>
      {/* <GroupJoinPane /> */}
      {/* <GroupJoinPane />
      <GroupJoinPane /> */}
    </div>
  );
}
