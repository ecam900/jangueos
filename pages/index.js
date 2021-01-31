import { makeStyles, Paper, TextField, Typography } from '@material-ui/core';
import Head from 'next/head';
import GroupJoinPane from '../components/GroupJoinPane';
import Feature from '../components/home/Feature';
import features from '../components/home/features';
import { useAuth } from '../lib/auth';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    justifyItems: 'center',
  },
}));

export default function Home() {
  const classes = useStyles();
  const auth = useAuth();

  return (
    <div className={classes.root}>
      <GroupJoinPane />
      {/* <GroupJoinPane />
      <GroupJoinPane /> */}
    </div>
  );
}
