import { WithToolbarButton } from '../../implementation/Toolbars';

/** note entry config */
export interface NoteEntryConfig extends NoteNodeProps {
    /** type of note */
    type: `note-${string}`;
}

export interface NoteNodeProps {
    /** border color */
    borderColor: string;
    /** background color */
    backgroundColor: string;
    /** icon */
    icon: React.FC;
}

/** note plugin options */
export type NotePluginOptions = WithToolbarButton & {
    /** notes list */
    notes: NoteEntryConfig[];
};

export interface NoteIconProps {
    backgroundColor: string;
}
