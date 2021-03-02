import Scrollbars, * as CustomScrollBars from 'react-custom-scrollbars';
import * as React from 'react';
import { IHasCX, cx } from '@epam/uui';
import * as css from './ScrollBars.scss';
import * as ReactDOM from 'react-dom';

export interface ScrollbarProps extends IHasCX, CustomScrollBars.ScrollbarProps {
    hasTopShadow?: boolean;
    hasBottomShadow?: boolean;
}

export interface PositionValues extends CustomScrollBars.positionValues {

}

export class ScrollBars extends React.Component<ScrollbarProps, any> {
    scrollBars: Scrollbars;

    componentDidMount() {
        this.handleUpdateScroll();
    }

    componentDidUpdate() {
        this.handleUpdateScroll();
    }

    setRefs = (scrollBars: Scrollbars) => {
        this.scrollBars = scrollBars;
    }

    handleUpdateScroll = () => {
        const scrollBars = this.scrollBars && ReactDOM.findDOMNode(this.scrollBars) as Element;
        let scrollValues = this.scrollBars.getValues();
        let showBottomShadow = this.props.hasBottomShadow && (scrollValues.scrollHeight - scrollValues.clientHeight > scrollValues.scrollTop);

        if (this.props.hasTopShadow && scrollValues.scrollTop > 0) {
            scrollBars?.classList?.add('uui-shadow-top-visible');
        } else {
            scrollBars?.classList?.remove('uui-shadow-top-visible');
        }

        if (showBottomShadow) {
            scrollBars?.classList?.add('uui-shadow-bottom-visible');
        } else {
            scrollBars?.classList?.remove('uui-shadow-bottom-visible');
        }
    }

    renderView = ({ style, ...props }: { style: {}, props: any }) => {
        return (
            <div
                style={ { ...style, ...{ position: 'relative', flex: '1 1 auto' } } }
                { ...props }
            />
        );
    }

    renderThumbVertical = () => <div className="uui-thumb"/>;

    renderThumbHorizontal = () => <div className="uui-thumb"/>;

    render() {
        let { renderView, style, ...restProps } = this.props;
        return (
            <CustomScrollBars.default
                { ...restProps }
                className={ cx(
                    css.root,
                    this.props.cx,
                    this.props.className,
                    this.props.hasTopShadow && "uui-shadow-top",
                    this.props.hasBottomShadow && "uui-shadow-bottom",
                ) }
                renderView={ renderView || this.renderView }
                renderThumbVertical={ this.renderThumbVertical }
                renderThumbHorizontal={ this.renderThumbHorizontal }
                style={ { ...{ display: 'flex' }, ...style } }
                onScroll={ e => {
                    this.handleUpdateScroll();
                    this.props.onScroll && this.props.onScroll(e);
                } }
                ref={ this.setRefs }
            >
                { this.props.children }
            </CustomScrollBars.default>
        );
    }
}
