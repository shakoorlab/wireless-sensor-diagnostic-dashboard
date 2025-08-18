import { RouterProvider } from 'react-router-dom';

// project import
import router from 'routes';
import ThemeCustomization from 'themes';

import Locales from 'components/Locales';
// import RTLLayout from 'components/RTLLayout';
import ScrollTop from 'components/ScrollTop';
import Snackbar from 'components/@extended/Snackbar';
import Notistack from 'components/third-party/Notistack';
import ErrorBoundary from 'components/error-boundary/ErrorBoundary';
import GlobalErrorCatcher from 'components/error-boundary/GlobalErrorCatcher';

// auth-provider
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      <Locales>
        <ScrollTop>
          <AuthProvider>
            <Notistack>
              <GlobalErrorCatcher>
                <ErrorBoundary>
                  <RouterProvider router={router} />
                </ErrorBoundary>
                <Snackbar />
              </GlobalErrorCatcher>
            </Notistack>
          </AuthProvider>
        </ScrollTop>
      </Locales>
    </ThemeCustomization>
  );
}
