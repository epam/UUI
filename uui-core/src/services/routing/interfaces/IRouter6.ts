/**
 * From: react-router version 6.14.0
 *
 * The type definition of the IRouter6 is not complete (It's OK as long as we only use a subset of its API)
 *
 * NOTE: Complete definitions of the router is located in @remix-run/router:
 * https://github.com/remix-run/react-router/blob/main/packages/router/router.ts#L57
 */
export type IRouter6 = {
    state: RouterState;
    navigate(to: To | null, opts?: RouterNavigateOptions): Promise<void>;
    navigate(to: number): Promise<void>;
    getBlocker: (key: string, fn: BlockerFunction) => unknown;
    subscribe: (fn: (state: RouterState) => void) => () => void;
    deleteBlocker: (key: string) => void;
    createHref(location: Location | URL): string;
};
export type RouterState = {
    location: Location;
    blockers: Map<string, unknown>;
    historyAction: Action;
};
export type BlockerFunction = (args: { nextLocation: Location, historyAction: Action }) => boolean;
export interface Location extends Path {
    state: any;
    key: string;
}
export type To = string | Partial<Path>;
export type Path = {
    pathname: string;
    search: string;
    hash: string;
};
export enum Action {
    Pop = 'POP',
    Push = 'PUSH',
    Replace = 'REPLACE'
}
type RouterNavigateOptions = {
    replace?: boolean;
    state?: any;
};
