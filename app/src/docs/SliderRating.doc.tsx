import * as React from 'react';
import * as loveship from '@epam/loveship';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';
import cx from 'classnames';
import css from './styles.module.scss';

export class SliderRatingDoc extends BaseDocsBlock {
    title = 'SliderRating';

    override config: TDocConfig = {
        name: 'SliderRating',
        contexts: [TDocContext.Default, TDocContext.Form],
        bySkin: {
            [TSkin.UUI3_loveship]: {
                type: '@epam/loveship:SliderRatingProps',
                component: loveship.SliderRating,
                doc: (doc: DocBuilder<loveship.SliderRatingProps<any>>) => {
                    const renderFn = (v: any) => (
                        <loveship.RichTextView size="14">
                            <p>
                                {`Selected value is ${v}.`}
                                <br />
                                {'You can use '}
                                <b>markup</b>
                                { ' via RichTextView here.'}
                            </p>
                        </loveship.RichTextView>
                    );
                    doc.merge('renderTooltip', { examples: [{ name: 'Custom Tooltip', value: renderFn }] });
                    doc.merge('value', { examples: [0, 1, 2, 3, 4, 5] });
                },
            },
        },
    };

    renderContent() {
        return (
            <span className={ cx(css.wrapper, css.uuiThemePromo) }>
                <EditableDocContent fileName="sliderRating-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/sliderRating/Basic.example.tsx" />
            </span>
        );
    }
}
