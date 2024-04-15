import 'normalize.css';
import '../styles/globals.scss';
import '@epam/uui-components/styles.css';
import '@epam/promo/styles.css';
import '@epam/uui/styles.css';
import '@epam/uui-editor/styles.css';
import { Blocker, ErrorHandler } from '@epam/promo';
import { AppHeader } from '../components/AppHeader';
import { SideBar } from '../components/SideBar';
import { Modals, Snackbar } from '@epam/uui-components';
import { DragGhost } from '@epam/uui-core';
import type { ComponentType } from 'react';

interface MyAppViewProps<TComponent, TPageProps> {
  Component: TComponent;
  pageProps: TPageProps;
  isChangingRoute: boolean;
}

export function MyAppView<TComponent extends ComponentType>(
  props: MyAppViewProps<TComponent, any>
) {
  const { Component, pageProps, isChangingRoute } = props;

  return (
    <ErrorHandler>
      <div className='container'>
        <AppHeader />
        <SideBar />
        <div className='mainContainer'>
          <Component {...pageProps} />
          {isChangingRoute && <Blocker isEnabled={isChangingRoute} />}
        </div>
        <Snackbar />
        <Modals />
        <DragGhost />
      </div>
    </ErrorHandler>
  );
}
