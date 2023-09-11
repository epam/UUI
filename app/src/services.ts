import { CommonContexts } from '@epam/uui-core';
import type { TApi } from './data';
import { MutableRefObject } from 'react';

export const svc: Partial<CommonContexts<TApi, { appTheme: MutableRefObject<string>, toggleTheme: (theme: string) => void }>> = {};
