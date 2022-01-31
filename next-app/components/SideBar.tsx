import {
    ScrollBars,
    VerticalTabButton,
} from '@epam/promo';
import React, { useState } from "react";
import { structure } from "../helpers/structure";
import { Tree } from '@epam/uui-components';
import { useRouter } from "next/router";

export const SideBar = () => {
    const [unfoldedIds, setUnfoldedIds] = useState<string[]>([]);
    const router = useRouter();

    return (
        <ScrollBars >
            <Tree
                items={ structure }
                value={ unfoldedIds }
                onValueChange={ setUnfoldedIds }
                renderRow={ item => (
                    <VerticalTabButton
                        caption={ item.data.name }
                        isLinkActive={ router.pathname === item.data.link.pathname }
                        link={ item.data.link }
                        size="36"
                        key={ item.id }
                    />
                ) }
            />
        </ScrollBars >
    );
};