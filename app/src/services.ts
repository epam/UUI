import { CommonContexts, UuiContexts } from '@epam/uui';
import type { TApi } from './data';
import type { CodesandboxContext } from './data/codesandbox/service';

export type BasicExampleServices = CommonContexts<TApi, UuiContexts>;
type EnhancedExampleServices = BasicExampleServices & CodesandboxContext;

export const svc: Partial<EnhancedExampleServices> = {};