import * as React from 'react';

export const SvgMock = React.forwardRef((props, ref) => React.createElement('svg', { ...props, ref }));
