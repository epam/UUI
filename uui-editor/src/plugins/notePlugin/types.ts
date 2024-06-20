import { WithToolbarButton } from '../../implementation/Toolbars';

/** note entry config */
export interface NoteEntryConfig extends NoteNodeProps {
    /** type of note */
    type: `note-${string}`;
    /** icon */
    icon: React.FC;
}

export interface NoteNodeProps {
    /** border color */
    borderColor: string;
    /** background color */
    backgroundColor: string;
}

/** note plugin options */
export type NotePluginOptions = WithToolbarButton & {
    /** notes list */
    notes: NoteEntryConfig[];
};
