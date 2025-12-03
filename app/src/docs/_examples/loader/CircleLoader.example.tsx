import React from 'react';
import { IconContainer } from '@epam/uui';
import { ReactComponent as CircleLoaderIcon } from '@epam/assets/icons/loaders/circle-loader.svg';
import css from '../../pages/assets/IconsPage.module.scss';

export default function CircleLoaderExample() {
    return (
        <IconContainer size="60" icon={ CircleLoaderIcon } cx={ css.previewIcon } />
    );
}
