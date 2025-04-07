import * as React from 'react';
import {
    IHasChildren, IHasCX, IHasRawProps, IModal, VPanelProps,
} from '../props';

export interface ModalWindowProps extends VPanelProps {}

export interface ModalBlockerProps extends IModal<any>, IHasCX, IHasChildren, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, Pick<React.RefAttributes<HTMLDivElement>, 'ref'> {
    /** Pass true to disabled locking focus inside modal.
     * If omitted, first clickable element of modal will receive focus on mount and focus will be looped inside modal.
     * */
    disableFocusLock?: boolean;
    /** Pass true to disabled modal closing by 'esc' key */
    disableCloseByEsc?: boolean;
    /** Pass true to disabled modal closing by click outside modal window */
    disallowClickOutside?: boolean;
    /**
     * Pass true to disable modal close by router change.
     * If omitted, modal window will be closed on any router change.
     */
    disableCloseOnRouterChange?: boolean;
}

export interface ModalHeaderCoreProps extends IHasChildren, IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    /** Called when cross icon in ModalHeader is clicked */
    onClose?: () => any;
    /** Modal title to display in header */
    title?: React.ReactNode;
}

export interface ModalFooterCoreProps extends IHasChildren, IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
}
