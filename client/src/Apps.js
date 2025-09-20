import { CssBaseline, ThemeProvider } from '@mui/material';
import { baselightTheme } from './theme/DefaultColors';
import { RouterProvider } from 'react-router-dom';
import Router from './routes/Router';
import { Provider } from 'react-redux';
import store from './store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CheatingLogProvider } from './context/CheatingLogContext';
import { HelmetProvider } from 'react-helmet-async';
import { modernTheme } from './theme/modernTheme';

function App() {
  const theme = modernTheme;
  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <CheatingLogProvider>
            <ToastContainer />
            <CssBaseline />
            <RouterProvider router={Router} />
          </CheatingLogProvider>
        </Provider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
