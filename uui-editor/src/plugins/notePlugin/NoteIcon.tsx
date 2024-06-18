import React from 'react';
import css from './NoteIcon.module.scss';
import { NoteIconProps } from './types';

export function NoteIcon({ backgroundColor }: NoteIconProps) {
    return (
        <div className={ css.iconWrapper } style={ { backgroundColor } }>
            <span>A</span>
        </div>
    );
}
