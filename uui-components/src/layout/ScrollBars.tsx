import { OverlayScrollbarsComponent, OverlayScrollbarsComponentProps } from 'overlayscrollbars-react';
import 'overlayscrollbars/css/OverlayScrollbars.css';
import React, { RefObject } from 'react';
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
    scrollBarsRef: RefObject<OverlayScrollbarsComponent>;

    constructor(props: any) {
        super(props);
        this.scrollBarsRef = React.createRef<OverlayScrollbarsComponent>();
    }

    componentDidMount() {
        this.handleUpdateScroll();
    }

    componentDidUpdate() {
        this.handleUpdateScroll();
    }



    handleUpdateScroll = () => {
        const scrollInstance = this.scrollBarsRef.current?.osInstance();
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
                ref={ this.scrollBarsRef }
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
