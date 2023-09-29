import * as React from 'react';
import {
    BaseDocsBlock, DocExample, EditableDocContent, TUuiTsDoc, UUI3, UUI4,
} from '../common';

export class RatingDoc extends BaseDocsBlock {
    title = 'Rating';

    // TODO: no such component in "@epam/uui"
    override getUuiTsDoc = (): TUuiTsDoc => ('@epam/uui-components:RatingProps');

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/inputs/rating.props.ts',
            [UUI4]: './app/src/docs/_props/epam-promo/components/inputs/rating.props.ts',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="rating-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/rating/Basic.example.tsx" />
            </>
        );
    }
}
