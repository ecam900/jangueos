import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../styles/theme';
import { AuthProvider } from '../lib/auth';
import Layout from '../components/layout/Layout';
import AuthGuard from '../lib/AuthGuard';
import { SnackbarProvider } from 'notistack';

export default function MyApp(props) {
  const { Component, pageProps, router } = props;

  let responsiveTextTheme = responsiveFontSizes(theme);

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  // Get dynamic persistent layouts with this.
  const getLayout =
    Component.getLayout || ((page) => <Layout children={page} />);

  return (
    <React.Fragment>
      <Head>
        <title>dimelo</title>
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width'
        />
      </Head>
      <ThemeProvider theme={responsiveTextTheme}>
        {/* Firebase Auth */}
        <AuthProvider>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <AuthGuard>
              <div>
                {getLayout(<Component {...pageProps} key={router.key} />)}
              </div>
            </AuthGuard>
          </SnackbarProvider>
        </AuthProvider>
      </ThemeProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
