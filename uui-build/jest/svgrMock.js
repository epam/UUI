// eslint-disable-next-line import/no-extraneous-dependencies
import * as React from 'react';

const svgrURL = 'SvgrURL';
export default svgrURL;

const SvgrMock = React.forwardRef((props, ref) => React.createElement('svg', { ...props, ref }));
export const ReactComponent = SvgrMock;
