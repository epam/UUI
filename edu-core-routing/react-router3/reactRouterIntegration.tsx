import * as React from 'react';
import clone from 'lodash.clone';
import merge from 'lodash.merge';
import { ReactRouter3Adapter } from './ReactRouter3Adapter';

export function convertToReactRouter3Schema(routes: any, renderRootComponent: (props: any) => React.ReactNode) {
    const children = buildChildRoutes(routes);

    return {
        path: '/',
        component: wrapRootComponent(renderRootComponent),
        ...children,
    };
}

function wrapRootComponent(renderRootComponent: (props: any) => React.ReactNode) {
    return function (props: any) {
        return <ReactRouter3Adapter>
            { renderRootComponent(props) }
        </ReactRouter3Adapter>;
    };
}

function buildChildRoutes(routes: any) {
    const result = {
        childRoutes: [] as any[],
        indexRoute: null as any,
    };
    Object.keys(routes).forEach(name => {
        if (name == 'index') {
            result.indexRoute = buildRoutesRec(routes[name], name);
        } else {
            result.childRoutes.push(buildRoutesRec(routes[name], name));
        }
    });
    return result;
}


function buildRoutesRec(route: any, parentPath: string): any {
    if (route.redirect) {
        return { onEnter: (nextState: {}, replace: Function) => replace(route.redirect()) };
    }

    const handler = route.handler;
    let result: any = {};
    let component = route.component;

    if (route.props) {
        component = makePropsPassingWrapper(component, route.props);
    }

    if (route.params) {
        for (let paramName in route.params) {
            parentPath += '/(:' + paramName + ')';
        }
        route = clone(route);
        delete route.params;

        return buildRoutesRec(route, parentPath);
    }

    result.path = parentPath;
    result.component = component;

    if (route.children) {
        result = {
            ...result,
            ...buildChildRoutes(route.children),
        };
    }

    return result;
}

function makePropsPassingWrapper(component: any, additionalProps: {}) {
    return class extends React.Component {
        static willTransitionTo() {
            component.willTransitionTo && component.willTransitionTo.apply(null, arguments);
        }
        static willTransitionFrom() {
            component.willTransitionFrom && component.willTransitionFrom.apply(null, arguments);
        }
        render() {
            const componentProps = merge({}, this.props, additionalProps);
            return React.createElement(component, componentProps, this.props.children);
        }
    };
}