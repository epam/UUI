import { getErrorPageConfig, getRecoveryMessageConfig } from '@epam/uui';
import { useUuiError } from '@epam/uui-core';
import React from 'react';

export const withErrorHandle = (Component: React.ComponentType) => {
  return function ErrorHandler(props: {}) {
    const { errorType, errorInfo } = useUuiError({
      getErrorInfo: (_, defaultInfo) => defaultInfo,
      options: {
        errorConfig: getErrorPageConfig(),
        recoveryConfig: getRecoveryMessageConfig(),
      },
    });

    if (errorType === 'error') {
      throw new Error('Something went wrong'); // TODO: create meaningful error type to pass error obj properly here
    }

    return <Component {...props} />;
  };
};
