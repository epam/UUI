import { ScrollBars, VerticalTabButton } from '@epam/promo';
import React from 'react';
import { structure } from '../helpers/structure';
import { usePathname } from 'next/navigation';
import { useUuiContext } from '@epam/uui-core';

export const SideBar = () => {
    const { uuiRouter } = useUuiContext();
    const pathname = usePathname();

    return (
        <div>
            { structure.map(item => (
                <VerticalTabButton
                    caption={item.name}
                    isActive={pathname === item.link.pathname}
                    onClick={(event) => {
                        event.preventDefault();
                        uuiRouter.redirect(item.link);
                    }}
                    size='36'
                    key={item.id}
                />
            ) ) }
        </div>
    );
};
