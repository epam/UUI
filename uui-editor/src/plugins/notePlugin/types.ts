import { WithToolbarButton } from '../../implementation/Toolbars';

export interface NoteEntryConfig extends NoteNodeProps {
    type: `note-${string}`;
}

export interface NoteNodeProps {
    borderColor?: string;
    backgroundColor?: string;
}

export type NotePluginOptions = WithToolbarButton & {
    notes?: NoteEntryConfig[];
};
