import { NoteEntryConfig } from './types';

import { ReactComponent as NoteIconLink } from '../../icons/info-block-link.svg';
import { ReactComponent as NoteIconQuote } from '../../icons/info-block-quote.svg';
import { ReactComponent as NoteIconError } from '../../icons/info-block-warning.svg';
import { ReactComponent as NoteIconWarning } from '../../icons/info-block.svg';

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

export const defaultNotesConfig: NoteEntryConfig[] = [
    {
        type: NOTE_QUOTE_TYPE,
        backgroundColor: 'var(--uui-secondary-5)',
        borderColor: 'var(--uui-secondary-50)',
        icon: NoteIconQuote,
    },
    {
        type: NOTE_ERROR_TYPE,
        backgroundColor: 'var(--uui-error-5)',
        borderColor: 'var(--uui-error-50)',
        icon: NoteIconError,
    },
    {
        type: NOTE_WARN_TYPE,
        backgroundColor: 'var(--uui-warning-5)',
        borderColor: 'var(--uui-warning-50)',
        icon: NoteIconWarning,
    },
    {
        type: NOTE_LINK_TYPE,
        backgroundColor: 'var(--uui-info-5)',
        borderColor: 'var(--uui-info-50)',
        icon: NoteIconLink,
    },
];
