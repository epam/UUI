import {IHasChildren, IHasCX, IModal, VPanelProps} from '../props';
import * as React from "react";

export interface ModalWindowProps extends VPanelProps {}

export interface ModalBlockerProps extends IModal<any>, IHasCX, IHasChildren {}

export interface ModalHeaderCoreProps extends IHasChildren, IHasCX {
    onClose?: () => any;
    title?: React.ReactNode;
}

export interface ModalFooterCoreProps extends IHasChildren {
    borderTop?: boolean;
}
