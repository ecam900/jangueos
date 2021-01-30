import { makeStyles, Typography } from '@material-ui/core';
import Head from 'next/head';
import Feature from '../components/home/Feature';
import features from '../components/home/features';

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
  return (
    <div className={classes.root}>
      <div>
        <Typography align='center' variant='h2'>
          Ready To Go With:
        </Typography>
        <div className={classes.featureList}>
          {features &&
            features.map((featureInfo, i) => (
              <>
                <Feature key={i} feature={featureInfo} />
              </>
            ))}
        </div>
      </div>
    </div>
  );
}
