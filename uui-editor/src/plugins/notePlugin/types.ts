import { WithToolbarButton } from '../../implementation/Toolbars';

export interface NodeConfig {
    notes?: NoteConfigItem[];
}

/** note entry config */
export interface NoteConfigItem extends NoteNodeProps {
    /** type of note */
    type: `note-${string}`;
}

export interface NoteNodeProps {
    /** border color */
    borderColor: string;
    /** background color */
    backgroundColor: string;
    /** icon */
    toolbarIcon: React.FC;
}

/** note plugin options */
export type NotePluginOptions = WithToolbarButton & {
    /** notes list */
    notes: NoteConfigItem[];
};
