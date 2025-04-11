import * as React from 'react';
import {
    Icon, IHasCX, NotificationOperation, NotificationContext, UuiContext, cx, IHasRawProps, IHasForwardedRef,
} from '@epam/uui-core';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import css from './Snackbar.module.scss';

const itemsOffset = 12;
const offset = 30;

export interface SnackbarProps extends IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IHasForwardedRef<HTMLDivElement> {
    closeIcon?: Icon;
    notifications?: NotificationOperation[];
}

const uuiSnackbar = {
    snackbar: 'uui-snackbar',
    itemWrapper: {
        self: 'uui-snackbar-item-wrapper-self',
        enter: 'uui-snackbar-item-wrapper-enter',
        exit: 'uui-snackbar-item-wrapper-exit',
        enterActive: 'uui-snackbar-item-wrapper-enter-active',
        exitActive: 'uui-snackbar-item-wrapper-exit-active',
    },
    itemWrapperCenter: {
        self: 'uui-snackbar-item-wrapper-center-self',
        enter: 'uui-snackbar-item-wrapper-enter',
        exit: 'uui-snackbar-item-wrapper-center-exit',
        enterActive: 'uui-snackbar-item-wrapper-enter-active',
        exitActive: 'uui-snackbar-item-wrapper-center-exit-active',
    },
    itemWrapperBottomCenter: {
        self: 'uui-snackbar-item-wrapper-center-self',
        enter: 'uui-snackbar-item-wrapper-enter',
        exit: 'uui-snackbar-item-wrapper-bottom-center-exit',
        enterActive: 'uui-snackbar-item-wrapper-enter-active',
        exitActive: 'uui-snackbar-item-wrapper-bottom-center-exit-active',
    },
    item: {
        self: 'uui-snackbar-item-self',
    },
    text: 'uui-snackbar-text',
    close: 'uui-snackbar-close',
    itemWrapperRight: {
        self: 'uui-snackbar-item-wrapper-right-self',
        enter: 'uui-snackbar-item-wrapper-enter',
        exit: 'uui-snackbar-item-wrapper-right-exit',
        enterActive: 'uui-snackbar-item-wrapper-enter-active',
        exitActive: 'uui-snackbar-item-wrapper-right-exit-active',
    },
};

export class Snackbar extends React.Component<SnackbarProps> {
    static contextType = UuiContext;
    context: { uuiNotifications: NotificationContext };
    private itemsHeights: { [id: number]: number } = {};
    public componentDidMount() {
        this.context.uuiNotifications.subscribe(() => this.forceUpdate());
    }

    private updateHeight(item: NotificationOperation, node: Element | null) {
        if (node) {
            const height = node.clientHeight;
            if (this.itemsHeights[item.props.id] !== height) {
                this.itemsHeights[item.props.id] = height;
                setTimeout(() => this.forceUpdate(), 0);
            }
        }
    }

    public renderItem(item: NotificationOperation, position: number) {
        const isItemOnBottom = item.config.position === 'bot-left' || item.config.position === 'bot-right' || item.config.position === 'bot-center' || !item.config.position;
        const isItemOnLeftSide = item.config.position === 'bot-left' || item.config.position === 'top-left' || !item.config.position;
        const isItemOnCenter = item.config.position === 'bot-center' || item.config.position === 'top-center';
        let style = uuiSnackbar.itemWrapper;
        if (isItemOnCenter) {
            style = isItemOnBottom ? uuiSnackbar.itemWrapperBottomCenter : uuiSnackbar.itemWrapperCenter;
        } else if (!isItemOnLeftSide) {
            style = uuiSnackbar.itemWrapperRight;
        }

        const transitionRef = React.createRef<HTMLDivElement>();
        let className;
        if (isItemOnLeftSide) {
            className = uuiSnackbar.itemWrapper.self;
        } else {
            className = isItemOnCenter ? uuiSnackbar.itemWrapperCenter.self : uuiSnackbar.itemWrapperRight.self;
        }
        return (
            <CSSTransition nodeRef={ transitionRef } classNames={ style } timeout={ 200 } key={ item.props.id }>
                <div
                    ref={ transitionRef }
                    className={ className }
                    key={ item.props.key }
                    style={ isItemOnBottom ? { bottom: position } : { top: position } }
                >
                    <div
                        className={ cx(uuiSnackbar.item.self) }
                        ref={ (node) => {
                            this.updateHeight(item, node);
                        } }
                    >
                        {React.createElement(item.component, item.props)}
                    </div>
                </div>
            </CSSTransition>
        );
    }

    private renderItemWithOffset(offsetCounterParam: number) {
        let offsetCounter = offsetCounterParam;
        return (item: NotificationOperation) => {
            const height = this.itemsHeights[item.props.id] || 0;
            const renderItem = this.renderItem(item, height > 0 ? offsetCounter : -300);
            offsetCounter += height + itemsOffset;
            return renderItem;
        };
    }

    public render() {
        const items: NotificationOperation[] = this.props.notifications ? this.props.notifications : this.context.uuiNotifications.getNotifications().slice().reverse();
        const botLeftOffset = offset;
        const botRightOffset = offset;
        const topLeftOffset = offset;
        const topRightOffset = offset;
        const topCenterOffset = offset;
        const botCenterOffset = offset;

        const botLeftItems = items
            .filter((item: NotificationOperation) => item.config.position === 'bot-left' || !item.config.position)
            .map(this.renderItemWithOffset(botLeftOffset));

        const botRightItems = items.filter((item: NotificationOperation) => item.config.position === 'bot-right').map(this.renderItemWithOffset(botRightOffset));

        const topLeftItems = items.filter((item: NotificationOperation) => item.config.position === 'top-left').map(this.renderItemWithOffset(topLeftOffset));

        const topRightItems = items.filter((item: NotificationOperation) => item.config.position === 'top-right').map(this.renderItemWithOffset(topRightOffset));

        const topCenterItems = items.filter((item: NotificationOperation) => item.config.position === 'top-center').map(this.renderItemWithOffset(topCenterOffset));

        const botCenterItems = items.filter((item: NotificationOperation) => item.config.position === 'bot-center').map(this.renderItemWithOffset(botCenterOffset));

        return (
            <div className={ cx(css.container, uuiSnackbar.snackbar, this.props.cx) } { ...this.props.rawProps } ref={ this.props.forwardedRef }>
                <TransitionGroup>
                    {botLeftItems}
                    {botRightItems}
                    {topLeftItems}
                    {topRightItems}
                    {topCenterItems}
                    {botCenterItems}
                </TransitionGroup>
            </div>
        );
    }
}
