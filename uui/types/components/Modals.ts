import * as React from "react";
import { IHasChildren, IHasCX, IHasRawProps, IModal, VPanelProps } from '../props';

export interface ModalWindowProps extends VPanelProps {}

export interface ModalBlockerProps extends IModal<any>, IHasCX, IHasChildren, IHasRawProps<HTMLDivElement> {}

export interface ModalHeaderCoreProps extends IHasChildren, IHasCX {
    onClose?: () => any;
    title?: React.ReactNode;
}

export interface ModalFooterCoreProps extends IHasChildren {
    borderTop?: boolean;
}
