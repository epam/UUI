import '../styles/globals.css';
import '@epam/uui-components/styles.css';
import '@epam/promo/styles.css';

import { UuiContext, DragGhost } from '@epam/uui';
import type { AppProps } from 'next/app';
import { ErrorHandler, Blocker } from '@epam/promo';
import { Snackbar, Modals } from "@epam/uui-components";
import { useServices } from '../hooks/useServices';
import {AppHeader} from "../components/AppHeader";

function MyApp({ Component, pageProps }: AppProps) {
  const { services, isLoading } = useServices();
  return (
      <UuiContext.Provider value={ services }>
         <ErrorHandler>
            <AppHeader />
            <Component { ...pageProps } />
            { isLoading && <Blocker isEnabled={ isLoading }/> }
            <Snackbar />
            <Modals />
            <DragGhost />
        </ErrorHandler>
      </UuiContext.Provider>
  )
}

export default MyApp
