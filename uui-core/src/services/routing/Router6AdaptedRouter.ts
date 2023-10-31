import { IRouterContext } from '../../types/contexts';
import { Link } from '../../types/objects';
import { queryToSearch } from '../../helpers/queryToSearch';
import { searchToQuery } from '../../helpers/searchToQuery';
import { Action, BlockerFunction, IRouter6, Location, To } from './interfaces/IRouter6';

export type { IRouter6 };

type History4Action = 'PUSH' | 'POP' | 'REPLACE';
function mapRouter6ActionToHistory4Action(src: Action): History4Action {
    if (src === Action.Pop) {
        return 'POP';
    } else if (src === Action.Push) {
        return 'PUSH';
    }
    return 'REPLACE';
}

/**
 * Adds exactly 1 beforeunload event. It is no-op is such event is already added.
 * It's needed to make react-router 6 compatible with "history.block".
 */
export function getBeforeUnloadSingletone() {
    const BeforeUnloadEventType = 'beforeunload';
    let _unblockFn: () => void;

    return {
        ensureBlock: () => {
            if (_unblockFn) {
                return;
            }
            function promptBeforeUnload(event: BeforeUnloadEvent) {
                // According to the specification, to show the confirmation dialog an event handler should call preventDefault() on the event.
                event.preventDefault();
                event.returnValue = '';
            }
            window.addEventListener(BeforeUnloadEventType, promptBeforeUnload);
            _unblockFn = function unblockFn() {
                window.removeEventListener(BeforeUnloadEventType, promptBeforeUnload);
            };
        },
        unblock: () => {
            if (_unblockFn) {
                _unblockFn();
                _unblockFn = undefined;
            }
        },
    };
}

export function getRouter6BlockFn(router: IRouter6) {
    let blockerKeyIndex = 0;
    // uui- prefix looks sufficient so that we don't interfere with any internal blockers of router 6.
    const nextBlockerKey = () => `uui-${++blockerKeyIndex}`;
    const beforeUnloadSingletone = getBeforeUnloadSingletone();

    return function router6BlockFn(blockerFunction: (location: Location, action: History4Action) => void) {
        const _blockerFn: BlockerFunction = (params) => {
            blockerFunction(params.nextLocation, mapRouter6ActionToHistory4Action(params.historyAction));
            return true;
            // true means - block navigation.
            // we want to be compatible with the history 5 behavior for "block" as much as possible.
            // I.e.: keep navigation blocked until unblock function is explicitly invoked.
            // https://github.com/remix-run/history/blob/dev/docs/blocking-transitions.md
        };
        const key = nextBlockerKey();
        router.getBlocker(key, _blockerFn);
        beforeUnloadSingletone.ensureBlock();
        return function unblock() {
            router.deleteBlocker(key);
            if (router.state.blockers.size === 0) {
                // keep this singletone as long as there are any blockers
                beforeUnloadSingletone.unblock();
            }
        };
    };
}

function locationToLink(loc: Location): Link {
    return {
        ...loc,
        query: searchToQuery(loc.search),
    };
}
const withFallback = <T>(v: T, fallback: string = '') => typeof v !== 'undefined' ? v : fallback;
function linkToRouter6Dest(link: Link): { to: To, state?: any } {
    return {
        to: {
            hash: withFallback(link.hash),
            search: queryToSearch(link.query) || link.search,
            pathname: withFallback(link.pathname),
        },
        state: link.state,
    };
}

function linkToLocation(link: Link): Location {
    return {
        hash: withFallback(link.hash),
        search: queryToSearch(link.query),
        pathname: withFallback(link.pathname),
        key: withFallback(link.key),
        state: link.state,
    };
}

/**
 *
 * NOTE: Next methods/properties of the router are marked as PRIVATE - DO NOT USE in the https://github.com/remix-run/react-router/blob/main/packages/router/router.ts#L57
 *  - state
 *  - getBlocker
 *  - subscribe
 *  - deleteBlocker
 *  - createHref
 * So we should be extra careful if decide to use another version of the react-router.
 * Though, it's OK to use such API, because there are no alternatives yet (see https://github.com/remix-run/react-router/issues/9422)
 *
 * IMPORTANT: As of now, it was tested only using react-router 6.14.0
 */
export class Router6AdaptedRouter implements IRouterContext {
    constructor(private router6: IRouter6) {}

    public getCurrentLink(): Link {
        return locationToLink(this.router6.state.location);
    }

    public redirect(link: Link | string): void {
        // NOTE: navigate is async in the router 6
        if (typeof link === 'string') {
            this.router6.navigate(link);
        } else {
            const { to, state } = linkToRouter6Dest(link);
            this.router6.navigate(to, { state });
        }
    }

    public transfer(link: Link): void {
        // NOTE: it's async in the router 6
        const { to, state } = linkToRouter6Dest(link);
        this.router6.navigate(to, { state, replace: true });
    }

    public isActive(link: Link): boolean {
        const current = this.getCurrentLink();
        return current.pathname === link.pathname;
    }

    public createHref(link: Link): string {
        return this.router6.createHref(linkToLocation(link));
    }

    public listen(listener: (link: Link) => void) {
        return this.router6.subscribe((rState) => {
            listener(rState.location);
        });
    }

    public block: (listener: (link: Link) => void) => () => void = getRouter6BlockFn(this.router6);
}
