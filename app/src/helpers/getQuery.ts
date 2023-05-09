import { svc } from '../services';

export function getQuery<T>(query: string): T {
    return svc.uuiRouter.getCurrentLink().query[query];
}
