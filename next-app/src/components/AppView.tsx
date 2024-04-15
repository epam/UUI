'use client';

import { useEffect, Suspense, PropsWithChildren } from 'react';
import { ErrorHandler } from '@epam/promo';
import { Modals, Snackbar } from '@epam/uui-components';
import {
  DragGhost,
  GAListener,
  UuiContext,
  useNextAppRouter,
  useUuiServices,
} from '@epam/uui-core';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { SideBar } from './SideBar';
import { AppHeader } from './AppHeader';
import Loading from '../app/loading';
import { TApi, apiDefinition } from '../helpers/apiDefinition';
import { AppContextType } from '../helpers/appContext';
import { AmplitudeListener } from '../helpers/ampListener';

const AMPLITUDE_KEY = 'b2260a6d42a038e9f9e3863f67042cc1';
const GA_KEY = 'UA-132675234-1';

export function AppView({ children }: PropsWithChildren) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const appRouterAdapter = useNextAppRouter({
    router,
    pathname,
    searchParams,
  });

  const { services } = useUuiServices<TApi, AppContextType>({
    apiDefinition,
    router: appRouterAdapter,
  });

  useEffect(() => {
    services.uuiAnalytics.addListener(new AmplitudeListener(AMPLITUDE_KEY));
    services.uuiAnalytics.addListener(new GAListener(GA_KEY));
  }, [services.uuiAnalytics]);

  return (
    <UuiContext.Provider value={services}>
      <ErrorHandler>
        <AppHeader />
        <SideBar />
        <div className='mainContainer'>
          {/* https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#instant-loading-states */}
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </div>
        <Snackbar />
        <Modals />
        <DragGhost />
      </ErrorHandler>
    </UuiContext.Provider>
  );
}
