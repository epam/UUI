import { useEffect, useLayoutEffect } from 'react';

/**
 * NextJs doesn't support useLayoutEffect, this code suppresses the warning by replacing useLayoutEffect to useEffect in SSR.
 * See also the discussion here: https://github.com/facebook/react/issues/14927#issuecomment-572720368
 */
export const useLayoutEffectSafeForSsr = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
