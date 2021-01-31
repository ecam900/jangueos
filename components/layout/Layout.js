import { Button, makeStyles, Typography } from '@material-ui/core';
import Link from 'next/link';
import { useAuth } from '../../lib/auth';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  topNav: {
    minHeight: '10vh',
    color: theme.palette.primary.main,
    backgroundColor: 'lightgrey',
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  childrenWrapper: { flexGrow: '1' },
  footer: {
    flexShrink: 0,
    minHeight: '10vh',
    backgroundColor: 'lightgrey',
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    cursor: 'pointer',
  },
}));

const Layout = ({ children }) => {
  const classes = useStyles();
  const auth = useAuth();
  return (
    <div className={classes.root}>
      <div className={classes.topNav}>
        <div className={classes.logo}>
          <Link href='/'>
            <Typography variant='h3'>jangueo</Typography>
          </Link>
        </div>
        {auth.user && (
          <Button onClick={() => auth.signOut()} size='small' color='primary'>
            LOG OUT
          </Button>
        )}
      </div>
      <div className={classes.childrenWrapper}>{children}</div>
      <div className={classes.footer}>
        <Typography style={{ width: '100%' }} align='center' variant='caption'>
          copyright © jangueo {new Date().getFullYear()}
        </Typography>
      </div>
    </div>
  );
};

export default Layout;
