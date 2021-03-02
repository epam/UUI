import React from 'react';
import { DocBuilder, isDisabledDoc } from '@epam/uui-docs';
import { AccordionProps } from '@epam/uui-components';
import { Accordion, AccordionMods, Button, FlexRow, FlexSpacer, Text, RichTextView } from '../../../components';
import { ResizableContext } from '../../../docs';

const accordionDoc = new DocBuilder<AccordionProps & AccordionMods>({ name: 'Accordion', component: Accordion })
    .implements([isDisabledDoc] as any)
    .prop('title', { examples: [{ value: 'Accordion title', isDefault: true }, 'Additional info'] })
    .prop('children', { examples: [
        {
            name: 'Simple text 14px',
            value: <RichTextView>
                <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
                anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
                sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </span>
            </RichTextView>,
            isDefault: true,
        },
        {
            name: 'Simple text 12px',
            value: <RichTextView size='12' >
                <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
                anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
                sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </span>
            </RichTextView>,
        },
        {
            name: 'Marked up content',
            value: <React.Fragment>
                <Text size={ '36' } font='sans' > Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                    irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
                    anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                    in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
                    sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </Text>
                <FlexRow spacing='6' >
                    <FlexSpacer/>
                    <Button fill='white' color='gray50' caption='Cancel' onClick={ () => {} }/>
                    <Button color='green' caption='Accept' onClick={ () => {} }/>
                </FlexRow>
            </React.Fragment>,
        }] })
    .prop('mode', { examples: [{ value: 'block', isDefault: true }, 'inline'] })
    .withContexts(ResizableContext);

export = accordionDoc;