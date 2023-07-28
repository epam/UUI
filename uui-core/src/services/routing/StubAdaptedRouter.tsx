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

    public redirect(): void {
        this.throwError();
    }

    public transfer(): void {
        this.throwError();
    }

    public isActive(): boolean {
        this.throwError();
        return false;
    }

    public createHref(): string {
        this.throwError();
        return '';
    }

    public listen(): () => void {
        this.throwError();
        return () => {};
    }

    public block(): () => void {
        this.throwError();
        return () => {};
    }
}
