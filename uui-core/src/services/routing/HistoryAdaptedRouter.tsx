import { Link } from '../../types/objects';
import { IRouterContext } from '../../types/contexts';
import { queryToSearch } from '../../helpers/queryToSearch';
import { searchToQuery } from '../../helpers/searchToQuery';

export interface IHistory4 {
    location: Link;
    push(link: Link): void;
    replace(link: Link): void;
    createHref(link: Link): string;
    listen(listener: (location: Link) => void): () => void;
    block(listener: (args: any) => any): () => void;
}

export class HistoryAdaptedRouter implements IRouterContext {
    constructor(private history: IHistory4) {}
    public getCurrentLink(): Link {
        return HistoryAdaptedRouter.searchToQuery(this.history.location);
    }

    public redirect(link: Link): void {
        this.history.push(HistoryAdaptedRouter.queryToSearch(link));
    }

    public transfer(link: Link): void {
        this.history.replace(HistoryAdaptedRouter.queryToSearch(link));
    }

    public isActive(link: Link): boolean {
        const current = this.getCurrentLink();
        return current.pathname === link.pathname;
    }

    public createHref(link: Link): string {
        return this.history.createHref(HistoryAdaptedRouter.queryToSearch(link));
    }

    public listen(listener: (link: Link) => void) {
        return this.history.listen(listener);
    }

    public block(listener: (link: Link) => void) {
        return this.history.block((location) => {
            listener(location);
            return false;
        });
    }

    private static searchToQuery(link: Link): Link {
        if (link.query !== undefined) return link;

        return {
            ...link,
            query: searchToQuery(link.search),
        };
    }

    private static queryToSearch(link: Link): Link {
        if (!link.query) return link;

        return {
            ...link,
            search: queryToSearch(link.query),
        };
    }
}
