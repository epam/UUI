import { OverlayScrollbarsComponent, OverlayScrollbarsComponentProps } from 'overlayscrollbars-react';
import 'overlayscrollbars/css/OverlayScrollbars.css';
import React from 'react';
import cx from 'classnames';
import { IHasCX } from '@epam/uui';
import * as css from './ScrollBars.scss';

export interface ScrollbarProps extends IHasCX, OverlayScrollbarsComponentProps {
    hasTopShadow?: boolean;
    hasBottomShadow?: boolean;
    style?: React.CSSProperties;
}

export interface IScrollbarsPositionValues {
    top?: number;
    left?: number;
    clientWidth?: number;
    clientHeight?: number;
    scrollWidth?: number;
    scrollHeight?: number;
    scrollLeft?: number;
    scrollTop?: number;
}

export class ScrollBars extends React.Component<ScrollbarProps, { [key: string]: any }> {
    scrollBars: OverlayScrollbarsComponent;

    componentDidMount() {
        this.handleUpdateScroll();
    }

    componentDidUpdate() {
        this.handleUpdateScroll();
    }

    setRefs = (scrollBars: OverlayScrollbarsComponent) => {
        this.scrollBars = scrollBars;
    }

    handleUpdateScroll = () => {
        const scrollInstance = this.scrollBars?.osInstance();
        if (!scrollInstance) return;
        const scrollbarsNode = scrollInstance.getElements().viewport;
        const { scrollTop, clientHeight, scrollHeight } = scrollbarsNode;
        let showBottomShadow = this.props.hasBottomShadow && (scrollHeight - clientHeight > scrollTop);

        if (this.props.hasTopShadow && scrollTop > 0) {
            scrollbarsNode.classList.add('uui-shadow-top-visible');
        } else {
            scrollbarsNode.classList.remove('uui-shadow-top-visible');
        }

        if (showBottomShadow) {
            scrollbarsNode.classList.add('uui-shadow-bottom-visible');
        } else {
            scrollbarsNode.classList.remove('uui-shadow-bottom-visible');
        }
    }

    render() {
        const { hasBottomShadow, hasTopShadow } = this.props;
        return (
            <OverlayScrollbarsComponent
                { ...this.props }
                className={ cx(
                    css.root,
                    this.props.cx,
                    hasTopShadow && "uui-shadow-top",
                    hasBottomShadow && "uui-shadow-bottom",
                ) }
                ref={ this.setRefs }
                options={ {
                    paddingAbsolute: true,
                    scrollbars: {
                        autoHide: 'leave',
                    },
                    callbacks: {
                        onScroll: this.handleUpdateScroll,
                    },
                } }
            >
                { this.props.children }
            </OverlayScrollbarsComponent>
        );
    }
}
