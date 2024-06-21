import React from 'react';
import { FlexCell, FlexRow, IconContainer, Text } from '@epam/uui';
import css from './IntroBlock.module.scss';
import { ReactComponent as BrushIcon } from '../icons/brush.svg';
import { ReactComponent as BracketsIcon } from '../icons/brackets.svg';
import { getCurrentTheme } from '../helpers';
import cx from 'classnames';

export function IntroBlock() {
    const theme = getCurrentTheme();
    const getHeaderClassName = (baseClass: string) => !!theme && theme === 'loveship_dark' ? `${baseClass}LoveshipDark` : `${baseClass}${theme.charAt(0).toUpperCase() + theme.slice(1)}`;

    return (
        <div className={ css.root }>
            <FlexRow cx={ css.info }>
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
                        <div className={ css.infoBlock }>
                            <IconContainer icon={ BrushIcon } cx={ css.infoStartIcon } />
                            <FlexCell grow={ 1 }>
                                <Text fontSize="18" lineHeight="24" fontWeight="600" cx={ css.infoBlockHeader }>Design</Text>
                                <Text fontSize="12" cx={ css.infoBlockText }>Start with design guidelines</Text>
                            </FlexCell>
                        </div>
                        <div className={ css.infoBlock }>
                            <IconContainer icon={ BracketsIcon } cx={ css.infoEndIcon } />
                            <FlexCell grow={ 1 }>
                                <Text fontSize="18" lineHeight="24" fontWeight="600" cx={ css.infoBlockHeader }>Develop</Text>
                                <Text fontSize="12" cx={ css.infoBlockText }>Find installation guides</Text>
                            </FlexCell>
                        </div>
                    </FlexRow>
                </div>
                <div className={ css.infoEnd }>

                </div>
            </FlexRow>
        </div>
    );
}
