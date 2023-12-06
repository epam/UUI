import { PlainTreeStrategyProps } from './strategies';

export type UseTreeStrategyProps<TItem, TId, TFIlter = any> = (PlainTreeStrategyProps<TItem, TId, TFIlter>);
export type UseTreeProps<TItem, TId, TFIlter = any> = {} & UseTreeStrategyProps<TItem, TId, TFIlter>;
