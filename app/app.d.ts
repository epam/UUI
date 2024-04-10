/// <reference path="../uui_globals.d.ts" />
/// <reference path="../public/docs/docsGenOutput/docsGenOutput.d.ts" />

declare let __COMMIT_HASH__: string;

// TBD: react-measure is abandoned, and it's typings are not compatible with modern react versions. We need to find a replacement.
// declare module 'react-measure';

declare module 'react-imask' {
    import IMask from 'imask';

    /**
     * The props accepted by react-imask, based
     * on the implementation of imask, with  some additions
     */
    export type IMaskInputProps = Partial<IMask.AnyMaskedOptions> & {
        mask: IMask.AnyMaskedOptions['mask'];
        blocks: { [key: string]: any };
        value: string;
        unmask?: boolean;
        onAccept?: (value: string, mask: IMask.InputMask<IMask.AnyMaskedOptions>, e: React.ChangeEvent<HTMLInputElement>) => void;
        onComplete?: (value: string, mask: IMask.InputMask<IMask.AnyMaskedOptions>, e: React.ChangeEvent<HTMLInputElement>) => void;
    };

    /**
     * A function that decorates a react component
     * with 'IMask' props
     * @param Component Any React Component
     */
    export function IMaskMixin<T, D>(
        Component: React.ComponentType<{ inputRef: React.Ref<D> } & T>,
    ): React.ComponentType<T & IMaskInputProps>;

    /**
     * A basic IMask React Input
     */
    export const IMaskInput: React.ComponentType<IMaskInputProps>;
}

declare module 'tether-tooltip';
declare module 'inline-style-transformer';
declare module 'draft-js-plugins-editor';
declare module 'draft-js-clear-formatting';
declare module 'draft-convert';
declare module 'draft-js-plugins-utils';
declare module 'draft-js/lib/*';
declare module 'prepend-http';
declare module 'slate-soft-break';
declare module 'slate-mark-hotkeys';
declare module '@convertkit/slate-lists';
declare module '@mercuriya/slate-linkify';
declare module '@mercuriya/slate-gallery';
declare module 'slate-drop-or-paste-images';
declare module 'slate-html-serializer';
declare module 'get-video-id';
declare module 'slate-uui-table-plugin';
declare module 'markdown-draft-js';
declare module 'react-breakpoints';
declare module 'react-broadcast';
declare module '@braintree/sanitize-url';
declare module 'htmlclean';
