import * as React from "react";
import { IHasChildren, IHasCX, IHasRawProps, IModal, VPanelProps, IHasForwardedRef } from '../props';

export interface ModalWindowProps extends VPanelProps, IHasForwardedRef<HTMLDivElement> {}

export interface ModalBlockerProps extends IModal<any>, IHasCX, IHasChildren, IHasRawProps<HTMLDivElement>, IHasForwardedRef<HTMLDivElement> {
    disableFocusLock?: boolean;
    disableCloseByEsc?: boolean;
}

export interface ModalHeaderCoreProps extends IHasChildren, IHasCX, IHasRawProps<HTMLDivElement> {
    onClose?: () => any;
    title?: React.ReactNode;
}

export interface ModalFooterCoreProps extends IHasChildren, IHasCX, IHasRawProps<HTMLDivElement> {
    borderTop?: boolean;
}
