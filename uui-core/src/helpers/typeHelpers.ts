export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;
export type Overwrite<T, U> = DistributiveOmit<T, keyof U> & U;
