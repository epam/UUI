import React from 'react';

/**
 * React forward-ref function, with a patched type, allowed generic types to pass-thru
 * More here: https://fettblog.eu/typescript-react-generic-forward-refs/
 * We go with re-export this way, instead of patching React typings, to not break typings in dependent projects.
 */
export const forwardRef = React.forwardRef as <T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
) => (props: P & React.RefAttributes<T>) => React.ReactElement | null;
