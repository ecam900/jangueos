import {
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  makeStyles,
  Container,
} from '@material-ui/core';
import {
  Grid, // our UI Component to display the results
  SearchBar, // the search bar the user will type into
  SearchContext, // the context that wraps and connects our components
} from '@giphy/react-components';
import { useState, useEffect, useContext } from 'react';

const useStyles = makeStyles((theme) => ({
  root: { zIndex: 2 },
  title: {
    fontSize: '1.3rem',
    padding: theme.spacing(1),
  },
  paper: {},
  searchBarWrapper: {
    paddingBottom: theme.spacing(2),
  },
}));

const GiphyGifs = ({ giphy }) => {
  const classes = useStyles();
  const [width, setWidth] = useState(window.innerWidth - 50);
  const [selectedGif, setSelectedGif] = useState(null);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const handleSelectGif = (gif) => {
    setSelectedGif(gif);
    console.log('Selected Gif is now: ', gif);
  };

  const { fetchGifs, searchKey } = useContext(SearchContext);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Container maxWidth='md'>
          <Typography
            color='secondary'
            align='left'
            variant='h3'
            className={classes.title}
          >
            Buscate un GIF
          </Typography>

          <div className={classes.searchBarWrapper}>
            <SearchBar />
          </div>
          <Grid
            noLink={true}
            onGifClick={(gif) => handleSelectGif(gif)}
            key={searchKey}
            columns={2}
            width={isDesktop ? 800 : width}
            fetchGifs={fetchGifs}
          />
        </Container>
      </Paper>
    </div>
  );
};

export default GiphyGifs;
