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
        buttonFill: 'var(--uui-neutral-60)',
        backgroundColor: 'var(--uui-secondary-5)',
        borderColor: 'var(--uui-secondary-50)',
    },
    {
        type: NOTE_ERROR_TYPE,
        buttonFill: 'var(--uui-text-critical)',
        backgroundColor: 'var(--uui-error-5)',
        borderColor: 'var(--uui-error-50)',
    },
    {
        type: NOTE_WARN_TYPE,
        buttonFill: 'var(--uui-text-warning)',
        backgroundColor: 'var(--uui-warning-5)',
        borderColor: 'var(--uui-warning-50)',
    },
    {
        type: NOTE_LINK_TYPE,
        buttonFill: 'var(--uui-text-info)',
        backgroundColor: 'var(--uui-info-5)',
        borderColor: 'var(--uui-info-50)',
    },
];
