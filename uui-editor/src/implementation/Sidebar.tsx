import * as React from 'react';
import * as css from './Sidebar.scss';
import { Editor, Plugins } from "slate-react";
import { uuiContextTypes, UuiContexts } from '@epam/uui';
import flatten from 'lodash.flatten';
import cx from 'classnames';

interface SidebarProps {
    editor: Editor;
    plugins: Plugins;
    isReadonly: boolean;
}

export class Sidebar extends React.Component<SidebarProps> {
    sidebar = React.createRef<HTMLDivElement>();
    static contextTypes = uuiContextTypes;
    context: UuiContexts;

    isSidebarVisible = () => {
        if (!this.props.editor || !this.props.editor.value.focusBlock) {
            return false;
        }

        return this.props.editor.value.selection.isFocused && !this.props.editor.readOnly;
    }

    renderSidebar = () => {
        return (
            <div className={ cx('slate-prevent-blur', css.sidebar) } ref={ this.sidebar } >
                { flatten(this.props.plugins).map((plugin: any) => plugin.sidebarButtons
                    && plugin.sidebarButtons.map((Button: any, index: number) =>
                        <Button editor={ this.props.editor } key={ `button-${index}` } />,
                    ))
                }
            </div>
        );
    }

    render() {
        if (this.props.isReadonly) {
            return null;
        }
        const isVisible = this.isSidebarVisible();

        return isVisible && this.renderSidebar();
    }
}