import * as React from "react";
import { Button } from '@epam/promo';


export function ButtonWithLink() {
    return (
        <>
            <Button caption='SPA Link' link={ {pathname: '/'} } />
            <Button caption='Link outside' href='https://www.epam.com/' />
            <Button caption='Link outside in new tab' href='https://www.epam.com/' target='_blank' />
        </>
    );
}