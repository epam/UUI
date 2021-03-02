import * as React from "react";
import { Link } from '../types';
import * as PropTypes from 'prop-types';
import { IRouterContext } from '@epam/uui';

export class ReactRouter3Adapter extends React.Component<{}, {}> {

    static contextTypes = {
        router: PropTypes.object,
    };

    uuiRouter: IRouterContext;

    constructor(props: any, context: any) {
        super(props);
        this.uuiRouter = new AdaptedRouter(context.router as any);
    }

    render() {
        return <>{ this.props.children }</>;
    }

    static childContextTypes = {
        uuiRouter: PropTypes.object,
        history: PropTypes.object,
    };

    getChildContext() {
        return {
            uuiRouter: this.uuiRouter,
        };
    }
}

// More convenient and TS-compatible wrapper for react-router stuff
class AdaptedRouter implements IRouterContext {
    constructor(private router: any) {
    }

    public location: Link = (this.router as any).location;
    public push = this.router.push.bind(this.router);
    public replace = this.router.replace.bind(this.router);
    public go = this.router.go.bind(this.router);
    public goBack = this.router.goBack.bind(this.router);
    public goForward = this.router.goForward.bind(this.router);
    public setRouteLeaveHook = () => {}; //this.router.setRouteLeaveHook.bind(this.router);
    public createPath = this.router.createPath.bind(this.router);
    public createHref = this.router.createHref.bind(this.router);

    public getCurrentLink(): Link {
        // Not sure it would work with any version of React Router 3. Contact me if issues arise. Yakov Zh.
        return (this.router as any).location;
    }


    // Drop non-necessary fields from link and convert it to object (it can be a function with pathname/query fields)
    public linkToLocation(link: Link) {
        return {
            pathname: link.pathname,
            query: link.query,
        };
    }

    /**
     * Redirects to the Link specified in the arguments by pushing
     * a new URL onto the history stack.
     */
    public redirect(link: Link | string): void | null {
        if (!link) {
            return null;
        }
        if (typeof link === "string") {
            return this.router.push(link);
        } else {
            return this.router.push(this.linkToLocation(link));
        }
    }


    /**
     * Transfer to the Link specified in the arguments by replacing top of the history with new url.
     */
    public transfer(link: Link | string): void | null {
        if (!link) {
            return null;
        }
        if (typeof link === "string") {
            return this.router.replace(link);
        } else {
            return this.router.replace(this.linkToLocation(link));
        }
    }

    /**
     * A helper method to determine if a given route, params, and committeeGeneralTabQuery
     * are active.
     */
    public isActive(link: Link) {
        return this.router.isActive(this.linkToLocation(link));
    }

    public listen(listener: (link: Link) => void): () => void {
        return this.router.listen(listener);
    }

    public block(listener: (link: Link) => void): () => void {
        return this.router.listenBefore((link: Link) => {
            listener(link);
            return false;
        });
    }
}