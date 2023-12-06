import { PlainTreeStrategyProps } from './strategies/types';

export type UseTreeStrategyProps<TItem, TId> = (PlainTreeStrategyProps<TItem, TId>);
export type UseTreeProps<TItem, TId, TFIlter = any> = {} & UseTreeStrategyProps<TItem, TId>;
