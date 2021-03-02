import { IRouterContext, Link } from "../../types";

export class StubAdaptedRouter implements IRouterContext {
    private warningMessage = "Warning: [RouterContext] there is not Router Adapter provided. StubAdapter is used";

    public getCurrentLink(): Link {
        console.error(this.warningMessage);
        return null;
    }

    public redirect(link: Link): void {
        console.error(this.warningMessage);
    }

    public transfer(link: Link): void {
        console.error(this.warningMessage);
    }

    public isActive(link: Link): boolean {
        console.error(this.warningMessage);
        return false;
    }

    public createHref(link: Link): string {
        console.error(this.warningMessage);
        return '';
    }

    public listen(listener: (link: Link) => void): () => void {
        console.error(this.warningMessage);
        return () => {};
    }

    public block(listener: (link: Link) => void): () => void {
        console.error(this.warningMessage);
        return () => {};
    }
}