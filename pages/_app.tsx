import type { AppProps } from 'next/app';
import Head from 'next/head';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { Provider } from 'next-auth/client';
import { useEffect } from 'react';

const theme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#FF6F6A',
    },
    secondary: {
      main: '#FFFFFF',
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <div>
      <Head>
        <title>CNAB</title>
      </Head>
      <ThemeProvider theme={theme}>
        <Provider session={pageProps.session}>
          <Component style={{ margin: 20 }} {...pageProps} />
        </Provider>
      </ThemeProvider>
    </div>
  );
}
export default MyApp;
