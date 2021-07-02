import { svc } from '../services';

export function getQuery(query: string): string {
    return svc.uuiRouter.getCurrentLink().query[query];
}