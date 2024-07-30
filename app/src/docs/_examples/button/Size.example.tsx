import React from 'react';
import { Button } from '@epam/uui';
import css from './Button.module.scss';

export default function SizeExample() {
    return (
        <div className={ css.size }>
            <Button color="primary" size="48" caption="Caption" />
            <Button color="primary" size="42" caption="Caption" />
            <Button color="primary" size="36" caption="Caption" />
            <Button color="primary" size="30" caption="Caption" />
            <Button color="primary" size="24" caption="Caption" />
        </div>
    );
}
