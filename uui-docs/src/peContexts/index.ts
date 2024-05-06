import { DemoComponentProps, TDocContext } from '../types';

import { DefaultContext } from './DefaultContext';
import { TabButtonContext } from './TabButtonContext';
import { FlexRowContext } from './FlexRowContext';
import { VerticalTabButtonContext } from './VerticalTabButtonContext';
import { FormContext } from './FormContext';
import { ResizableContext } from './ResizableContext';
import { RelativePanelContext } from './RelativePanelContext';
import { TableContext } from './TableContext';
import { PagePanelContext } from './PagePanelContext';
import { OpenedPickerInputContext } from './OpenedPickerInputContext';

/**
 * This map contains contexts for the "Property Explorer"
 */
export const uuiDocContextsMap: Record<TDocContext, React.ComponentType<DemoComponentProps<any>> | undefined> = {
    [TDocContext.Default]: DefaultContext,
    [TDocContext.FlexRow]: FlexRowContext,
    [TDocContext.Form]: FormContext,
    [TDocContext.PagePanel]: PagePanelContext,
    [TDocContext.RelativePanel]: RelativePanelContext,
    [TDocContext.Resizable]: ResizableContext,
    [TDocContext.TabButton]: TabButtonContext,
    [TDocContext.Table]: TableContext,
    [TDocContext.VerticalTabButton]: VerticalTabButtonContext,
    [TDocContext.OpenedPickerInput]: OpenedPickerInputContext,
};
