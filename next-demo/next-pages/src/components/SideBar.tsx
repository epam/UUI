import { ScrollBars, VerticalTabButton } from '@epam/promo';
import React from 'react';
import { structure } from '../helpers/structure';
import { Tree, TreeListItem } from '@epam/uui-components';
import { useRouter } from 'next/router';
import { DataSourceState, Link } from '@epam/uui-core';

interface TreeItem extends Omit<TreeListItem, 'data'> {
    link: Link;
    data: TreeListItem & { link: Link };
}

export function SideBar() {
    const [value, setValue] = React.useState<DataSourceState>({ folded: {} });
    const router = useRouter();

    return (
        <ScrollBars>
            <Tree<TreeItem>
                items={structure}
                value={value}
                onValueChange={setValue}
                renderRow={(item) => (
                    <VerticalTabButton
                        caption={item.value.name}
                        isLinkActive={
                            router.pathname === item.value.link.pathname
                        }
                        link={item.value.link}
                        size='36'
                        key={item.id}
                    />
                )}
            />
        </ScrollBars>
    );
}
