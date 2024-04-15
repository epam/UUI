import * as React from 'react';

// eslint-disable-next-line import/no-anonymous-default-export
export default 'svg';

const SvgrMock = React.forwardRef((props, ref) =>
  React.createElement('svg', { ...props, ref })
);

SvgrMock.displayName = 'SvgrMock';

export const ReactComponent = SvgrMock;
