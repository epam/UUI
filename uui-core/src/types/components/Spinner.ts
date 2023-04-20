import * as React from 'react';
import { IHasCX, IHasRawProps, IHasForwardedRef } from '../props';

export interface SpinnerCoreProps extends IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IHasForwardedRef<HTMLDivElement> {}
