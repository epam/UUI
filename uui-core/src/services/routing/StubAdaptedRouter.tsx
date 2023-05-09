import { IRouterContext, Link } from '../../types';

export class StubAdaptedRouter implements IRouterContext {
    private warningMessage = 'Warning: [RouterContext] there is not Router Adapter provided. StubAdapter is used';
    throwError() {
        if (process.env.NODE_ENV !== 'test') {
            console.error(this.warningMessage);
        }
    }

    public getCurrentLink(): Link {
        this.throwError();
        if (process.env.NODE_ENV === 'test') {
            return { pathname: '', query: {} };
        }
        return null;
    }

    public redirect(link: Link): void {
        this.throwError();
    }

    public transfer(link: Link): void {
        this.throwError();
    }

    public isActive(link: Link): boolean {
        this.throwError();
        return false;
    }

    public createHref(link: Link): string {
        this.throwError();
        return '';
    }

    public listen(listener: (link: Link) => void): () => void {
        this.throwError();
        return () => {};
    }

    public block(listener: (link: Link) => void): () => void {
        this.throwError();
        return () => {};
    }
}
