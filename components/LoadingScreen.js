import { Container, Typography } from '@material-ui/core';

const LoadingScreen = () => {
  return (
    <Container
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        alignContent: 'center',
        justifyItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography
        align='center'
        color='secondary'
        variant='h5'
        style={{ fontWeight: 'bold' }}
      >
        LOADING
      </Typography>
    </Container>
  );
};

export default LoadingScreen;
