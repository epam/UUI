import { svc } from '../services';
import { useSearchParams } from 'react-router-dom';

export function getQuery<T>(query: string): T {
    return svc.uuiRouter.getCurrentLink().query[query];
}

export function useQuery<T = string>(name: string): T {
    const [params] = useSearchParams();
    return params.get(name) as T;
}
