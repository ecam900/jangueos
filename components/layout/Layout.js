import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  topNav: {
    height: '10vh',
    color: theme.palette.primary.main,
    backgroundColor: 'lightgrey',
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
    display: 'flex',
    alignItems: 'center',
  },

  childrenWrapper: {
    minHeight: '80vh',
  },
  footer: {
    height: '10vh',
    backgroundColor: 'lightgrey',
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
    display: 'flex',
    alignItems: 'center',
  },
}));

const Layout = ({ children }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.topNav}>
        <div className={classes.logo}>
          <Typography variant='h3'>EC Starter</Typography>
        </div>
      </div>
      <div className={classes.childrenWrapper}>{children}</div>
      <div className={classes.footer}></div>
    </div>
  );
};

export default Layout;
