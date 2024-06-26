import React, { useState } from 'react';
import { Anchor, FlexCell, FlexRow, IconContainer, PickerInput, Text } from '@epam/uui';
import css from './IntroBlock.module.scss';
import { ReactComponent as BrushIcon } from '../icons/brush.svg';
import { ReactComponent as BracketsIcon } from '../icons/brackets.svg';
import { ReactComponent as BlurLightImage } from '../icons/intro-blur-light-theme.svg';
import { ReactComponent as BlurDarkImage } from '../icons/intro-blur-dark-theme.svg';
import { getCurrentTheme } from '../helpers';
import cx from 'classnames';
import { useArrayDataSource } from '@epam/uui-core';

const languageLevels = [
    { id: 2, level: 'A1' }, { id: 3, level: 'A1+' }, { id: 4, level: 'A2' }, { id: 5, level: 'A2+' }, { id: 6, level: 'B1' }, { id: 7, level: 'B1+' }, { id: 8, level: 'B2' }, { id: 9, level: 'B2+' }, { id: 10, level: 'C1' }, { id: 11, level: 'C1+' }, { id: 12, level: 'C2' },
];

export function IntroBlock() {
    const theme = getCurrentTheme();
    const getHeaderClassName = (baseClass: string) => !!theme && theme === 'loveship_dark' ? `${baseClass}LoveshipDark` : `${baseClass}${theme.charAt(0).toUpperCase() + theme.slice(1)}`;
    const [singlePickerValue, singleOnValueChange] = useState(null);
    const [multiPickerValue, multiOnValueChange] = useState(null);
    const BLUR = theme === 'loveship_dark' ? BlurDarkImage : BlurLightImage;

    // Create DataSource outside the Picker, by calling useArrayDataSource hook
    const dataSource = useArrayDataSource(
        {
            items: languageLevels,
        },
        [],
    );
    return (
        <div className={ css.root }>
            <FlexRow cx={ css.info }>
                <div>
                    <IconContainer icon={ BLUR } cx={ css.blur } />
                </div>
                <div className={ css.infoStart }>
                    <Text rawProps={ { role: 'heading', 'aria-level': 1 } } cx={ cx(css.introHeader, css[getHeaderClassName('introHeader')]) }>
                        Accelerate
                    </Text>
                    <Text cx={ cx(css.introHeaderText, css[getHeaderClassName('introHeaderText')]) }>
                        web applications development
                    </Text>
                    <Text fontSize="18" lineHeight="24" fontWeight="400" color="secondary" cx={ css.introHeaderLowerText }>
                        EPAM UUI is a complete set of components, guidelines, blueprints, examples, to build your apps on top of Figma, React and TypeScript
                    </Text>
                    <FlexRow columnGap="12" cx={ css.infoBlockWrapper }>
                        <Anchor cx={ css.infoBlock } href="/">
                            <IconContainer icon={ BrushIcon } cx={ css.infoStartIcon } />
                            <FlexCell grow={ 1 }>
                                <Text fontSize="18" lineHeight="24" fontWeight="600" cx={ css.infoBlockHeader }>Design</Text>
                                <Text fontSize="12" cx={ css.infoBlockText }>Start with design guidelines</Text>
                            </FlexCell>
                        </Anchor>
                        <Anchor cx={ css.infoBlock } href="/">
                            <IconContainer icon={ BracketsIcon } cx={ css.infoEndIcon } />
                            <FlexCell grow={ 1 }>
                                <Text fontSize="18" lineHeight="24" fontWeight="600" cx={ css.infoBlockHeader }>Develop</Text>
                                <Text fontSize="12" cx={ css.infoBlockText }>Find installation guides</Text>
                            </FlexCell>
                        </Anchor>
                    </FlexRow>
                </div>
                <div className={ css.infoEnd }>
                    <FlexCell width={ 612 }>
                        <FlexRow columnGap="12">
                            <PickerInput
                                dataSource={ dataSource }
                                value={ multiPickerValue }
                                onValueChange={ multiOnValueChange }
                                getName={ (item) => item.level }
                                entityName="Language level"
                                selectionMode="multi"
                                valueType="id"
                                sorting={ { field: 'level', direction: 'asc' } }
                            />
                            <PickerInput
                                dataSource={ dataSource }
                                value={ singlePickerValue }
                                onValueChange={ singleOnValueChange }
                                getName={ (item) => item.level }
                                entityName="Language level"
                                selectionMode="single"
                                valueType="id"
                                sorting={ { field: 'level', direction: 'asc' } }
                            />
                        </FlexRow>
                    </FlexCell>
                </div>
            </FlexRow>
        </div>
    );
}
