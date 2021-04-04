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
        zIndex: 9,
      }}
    >
      <Typography
        align='center'
        color='secondary'
        variant='h5'
        style={{ fontWeight: 'bold' }}
      >
        'Perate
      </Typography>
    </Container>
  );
};

export default LoadingScreen;
