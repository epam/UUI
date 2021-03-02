import React from 'react';
import { Spinner } from "./Spinner";

interface EmbeddedAppState {
    isLoading: boolean;
}

interface EmbeddedAppProps<TProps = any> {
    publicUrl: string;
    widgetName: string;
    props: TProps;
}

export class EmbeddedWidget<TProps = any> extends React.Component<EmbeddedAppProps<TProps>, EmbeddedAppState> {
    widgetNode: HTMLElement;

    state: EmbeddedAppState = {
        isLoading: true,
    };

    addScript(src: string) {
        if ([].find.call(document.getElementsByTagName('script'), (i: any) => i.src === src)) {
            return Promise.resolve(null);
        }

        return new Promise<void>((resolve, reject) => {
            const scriptNode = document.createElement('script');
            scriptNode.setAttribute('src', src);
            document.body.appendChild(scriptNode);
            scriptNode.onload = () => resolve();
            scriptNode.onerror = () => reject();
        });
    }

    addStyles(href: string) {
        if ([].find.call(document.getElementsByTagName('link'), (i: any) => i.href === href)) {
            return Promise.resolve(null);
        }

        return new Promise<void>((resolve, reject) => {
            const linkNode = document.createElement('link');
            linkNode.setAttribute('href', href);
            linkNode.setAttribute('rel', "stylesheet");
            document.head.appendChild(linkNode);
            linkNode.onload = () => resolve();
            linkNode.onerror = () => reject();
        });
    }

    componentDidMount() {
        // if ((window as any).uui ? (window as any).uui.embedWidget === undefined : true) {
        //     (window as any).uui = {
        //         ...(window as any).uui,
        //         embedWidget: () => { throw new Error('Set ReactDOM render function to window.uui.embedWidget in guest app'); },
        //     };
        // }

        fetch(this.props.publicUrl + '/asset-manifest.json').then(i => {
            i.json().then(manifest => {
                const jsFiles = Object.keys(manifest).filter(f => f.endsWith('js'));
                const cssFiles = Object.keys(manifest).filter(f => f.endsWith('css'));
                const loadTasks = [
                    ...jsFiles.map(file => this.addScript(this.props.publicUrl + manifest[file])),
                    ...cssFiles.map(file => this.addStyles(this.props.publicUrl + manifest[file])),
                ];
                Promise.all(loadTasks).then(() => {
                    this.setState({ isLoading: false });
                    (window as any)[this.props.widgetName](this.widgetNode, this.props.props);
                });
            });
        });
    }

    render() {
        if (this.state.isLoading) {
            return <Spinner />;
        }

        return (
            <div ref={ node => this.widgetNode = node } />
        );
    }
}