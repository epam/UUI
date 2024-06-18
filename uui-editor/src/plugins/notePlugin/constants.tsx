import React from 'react';
import { NoteIcon } from './NoteIcon';
import { NoteEntryConfig } from './types';

export const NODE_PLUGIN_KEY = 'note';

export const NOTE_ERROR_PLUGIN_KEY = 'note-error';
export const NOTE_ERROR_TYPE = 'note-error';

export const NOTE_WARN_PLUGIN_KEY = 'note-warning';
export const NOTE_WARN_TYPE = 'note-warning';

export const NOTE_LINK_PLUGIN_KEY = 'note-link';
export const NOTE_LINK_TYPE = 'note-link';

export const NOTE_QUOTE_PLUGIN_KEY = 'note-quote';
export const NOTE_QUOTE_TYPE = 'note-quote';

export const noteTypes = [NOTE_ERROR_TYPE, NOTE_WARN_TYPE, NOTE_LINK_TYPE, NOTE_QUOTE_TYPE];

export const defaultNotes: NoteEntryConfig[] = [
    {
        type: NOTE_QUOTE_TYPE,
        backgroundColor: 'var(--uui-secondary-5)',
        borderColor: 'var(--uui-secondary-50)',
        Icon: () => <NoteIcon backgroundColor="var(--uui-neutral-60)" />,
    },
    {
        type: NOTE_ERROR_TYPE,
        backgroundColor: 'var(--uui-error-5)',
        borderColor: 'var(--uui-error-50)',
        Icon: () => <NoteIcon backgroundColor="var(--uui-text-critical)" />,
    },
    {
        type: NOTE_WARN_TYPE,
        backgroundColor: 'var(--uui-warning-5)',
        borderColor: 'var(--uui-warning-50)',
        Icon: () => <NoteIcon backgroundColor="var(--uui-text-warning)" />,
    },
    {
        type: NOTE_LINK_TYPE,
        backgroundColor: 'var(--uui-info-5)',
        borderColor: 'var(--uui-info-50)',
        Icon: () => <NoteIcon backgroundColor="var(--uui-text-info)" />,
    },
];
