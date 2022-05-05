import { IRouterContext, Link } from "../../types";

export interface IHistory4 {
    location: Link;
    push(link: Link): void;
    replace(link: Link): void;
    createHref(link: Link): string;
    listen(listener: (location: Link) => void): () => void;
    block(listener: (args: any) => any): () => void;
}

export class HistoryAdaptedRouter implements IRouterContext {
    constructor(private history: IHistory4) {
    }

    public getCurrentLink(): Link {
        return HistoryAdaptedRouter.withQuery(this.history.location);
    }

    public redirect(link: Link): void {
        this.history.push(HistoryAdaptedRouter.withSearch(link));
    }

    public transfer(link: Link): void {
        this.history.replace(HistoryAdaptedRouter.withSearch(link));
    }

    public isActive(link: Link): boolean {
        const current = this.getCurrentLink();
        return current.pathname == link.pathname;
    }

    public createHref(link: Link): string {
        return this.history.createHref(HistoryAdaptedRouter.withSearch(link));
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
    
    private static withQuery(link: Link): Link {
        if (link.query !== undefined) return link;

        const query = {} as any;
        new URLSearchParams(link.search).forEach((value, key) => {
            query[key] = value;
        });
        
        return {
            ...link,
            query,
        };
    }
    
    private static withSearch(link: Link): Link {
        if (!link.query) return link;
        
        return {
            ...link,
            search: new URLSearchParams(link.query).toString(),
        };
    }
}