import { TDocContext } from '@epam/uui-docs';

import { DefaultContext } from './DefaultContext';
import { TabButtonContext } from './TabButtonContext';
import { FlexRowContext } from './FlexRowContext';
import { VerticalTabButtonContext } from './VerticalTabButtonContext';
import { FormContext } from './FormContext';
import { ResizableContext } from './ResizableContext';
import { RelativePanelContext } from './RelativePanelContext';
import { TableContext } from './TableContext';
import { PagePanelContext } from './PagePanelContext';

export { DefaultContext, TabButtonContext, FlexRowContext };

export const uuiDocContextsMap: Record<TDocContext, React.ComponentType<any> | undefined> = {
    [TDocContext.Default]: DefaultContext,
    [TDocContext.FlexRow]: FlexRowContext,
    [TDocContext.Form]: FormContext,
    [TDocContext.PagePanel]: PagePanelContext,
    [TDocContext.RelativePanel]: RelativePanelContext,
    [TDocContext.Resizable]: ResizableContext,
    [TDocContext.TabButton]: TabButtonContext,
    [TDocContext.Table]: TableContext,
    [TDocContext.VerticalTabButton]: VerticalTabButtonContext,
};
