import { createContext } from 'react';
import { CommonContexts } from '../types/contexts';

// UuiContext was moved to a separate file to break the cyclic dependency in many places.
export const UuiContext = createContext({} as CommonContexts<any, any>);
