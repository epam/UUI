import { ScrollBars, VerticalTabButton } from '@epam/promo';
import React from 'react';
import { structure } from '../helpers/structure';
import { Tree, TreeListItem } from '@epam/uui-components';
import { usePathname } from 'next/navigation';
import { DataSourceState, Link, useUuiContext } from '@epam/uui-core';

interface TreeItem extends Omit<TreeListItem, 'data'> {
    link: Link;
    data: TreeListItem & { link: Link };
}

export const SideBar = () => {
    const [value, setValue] = React.useState<DataSourceState>({ folded: {} });
    const { uuiRouter } = useUuiContext();
    const pathname = usePathname();

    return (
        <ScrollBars>
            <Tree<TreeItem>
                items={structure}
                value={value}
                onValueChange={setValue}
                renderRow={(item) => (
                    <VerticalTabButton
                        caption={item.value.name}
                        isLinkActive={pathname === item.value.link.pathname}
                        onClick={(event) => {
                            event.preventDefault();
                            uuiRouter.redirect(item.value.link);
                        }}
                        size='36'
                        key={item.id}
                    />
                )}
            />
        </ScrollBars>
    );
};
