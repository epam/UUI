import * as React from 'react';
import {
    FlexCell,
    FlexRow,
    Panel,
    ScrollBars, Spinner, Text, ErrorAlert,
} from '@epam/uui';
//
import css from './previewLayout.module.scss';
import { useRef, useState } from 'react';
import { useLayoutEffectSafeForSsr } from '@epam/uui-core';
import { SECTION_HEIGHT_LIMIT, TEST_AUTOMATION_MASK } from '../constants';

interface IPreviewLayout {
    isLoaded: boolean;
    renderToolbar: () => (React.ReactNode | undefined);
    renderUseCases: () => (React.ReactNode | undefined);
}

const LABEL_PREVIEW = 'Preview Content';

export function PreviewLayout(props: IPreviewLayout) {
    const sectionRef = useRef<HTMLElement>();
    const [height, setHeight] = useState<number>(0);
    const { renderUseCases, renderToolbar, isLoaded } = props;

    useLayoutEffectSafeForSsr(() => {
        if (sectionRef.current) {
            setHeight(sectionRef.current.offsetHeight);
        }
    });

    if (!isLoaded) {
        return (
            <div
                aria-busy={ true }
                role="region"
                aria-label={ LABEL_PREVIEW }
                style={ { height: '95vh' } }
            >
                <Spinner />
            </div>
        );
    }
    const isTooTall = height > SECTION_HEIGHT_LIMIT;
    return (
        <ScrollBars>
            <FlexRow cx={ css.root }>
                <FlexCell cx={ css.toolbar }>
                    <Panel
                        cx={ TEST_AUTOMATION_MASK }
                        shadow={ false }
                        rawProps={ {
                            role: 'region',
                            'aria-label': 'Preview Toolbar',

                        } }
                    >
                        { renderToolbar() }
                    </Panel>
                </FlexCell>
                <FlexCell>
                    {
                        isTooTall && (
                            <ErrorAlert>
                                <Text size="30">{ `Section height should not exceed ${SECTION_HEIGHT_LIMIT} px. Actual height: ${height} px.` }</Text>
                            </ErrorAlert>

                        )
                    }
                    <FlexRow
                        cx={ css.list }
                        rawProps={ { 'aria-label': LABEL_PREVIEW, role: 'region' } }
                        ref={ sectionRef }
                    >
                        {
                            renderUseCases()
                        }
                    </FlexRow>
                </FlexCell>
            </FlexRow>
        </ScrollBars>
    );
}
