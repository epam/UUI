import * as React from 'react';

export default 'SvgrURL';

const SvgrMock = React.forwardRef((props, ref) => React.createElement('svg', { ...props, ref}));
export const ReactComponent = SvgrMock;