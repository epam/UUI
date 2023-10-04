import React from 'react';
import { RichTextView, ScrollBars } from '@epam/uui';
import css from './Layout.module.scss';

type TLayoutProps = {
    title?: string;
    children: { title?: string, node?: React.ReactNode }[]
};

export function Layout(props: TLayoutProps) {
    const { title, children } = props;

    const renderItem = (cProps: TLayoutProps['children'][number], index: number) => {
        const key = `${index}${cProps.title}`;
        return (
            <div className={ css.innerBlock } key={ key }>
                { cProps.title && (
                    <RichTextView>
                        <h2>{cProps.title}</h2>
                    </RichTextView>
                )}
                { cProps.node }
            </div>
        );
    };

    return (
        <div className={ css.root }>
            <ScrollBars>
                <div className={ css.main }>
                    { title && (
                        <RichTextView>
                            <h1>{title}</h1>
                        </RichTextView>
                    )}
                    { children.map(renderItem) }
                </div>
            </ScrollBars>
        </div>
    );
}
