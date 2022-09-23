import React, { useState } from "react";
import { SmallBattery } from "./smallBattery/SmallBattery";
import { Button, Dropdown, FlexRow, LinkButton, Tooltip, Text, DropdownContainer, IconContainer, IconButton, FlexCell } from "@epam/promo";
import { cx, IDropdownToggler } from "@epam/uui-core";
import { DropdownBodyProps } from "@epam/uui-components";
import css from './SkillsBattery.scss';
import { ReactComponent as heartIconOutline } from '@epam/assets/icons/common/fav-rates-favorite-outline-18.svg';
import { ReactComponent as heartIconFilled } from '@epam/assets/icons/common/fav-rates-favorite-18.svg';
import { ReactComponent as arrowExpandIcon } from './icons/navigation-arrows_expand-18.svg';
import { ReactComponent as goFromPoint } from './icons/Logo.svg';
import { ReactComponent as noSkillIcon } from './icons/no-skill-18.svg';
import { ReactComponent as noActiveIcon } from './icons/no-active-18.svg';
import { ReactComponent as recommendedIcon } from './icons/recommended-18.svg';
import { ReactComponent as infoLogo } from './icons/notification-info-outline-10.svg';
import { ReactComponent as medalLogo } from './icons/Medal.svg';
import { ReactComponent as doneIcon } from '@epam/assets/icons/common/notification-done-12.svg';
import { BigBattery } from "./bigBattery/BigBattery";

export type ISkillRating = 1 | 2 | 3 | 4 | 'NA' | 'NoSkill' | 'Rank';

export const SkillsBattery = () => {
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const [isRecommended, setIsRecommended] = useState<boolean>(false);
    const [rating, setRating] = useState<ISkillRating>('NA');
    const [skillText, setSkillText] = useState();
    const targetBodyRef = React.createRef();

    const renderDropdownBody = (props: DropdownBodyProps) => {
        return (
            <DropdownContainer cx={ cx(css.dropContainer) }>
                <FlexRow cx={ cx(css.headerRow) }>
                    <Text fontSize="14" lineHeight="24" font="sans" cx={ cx(css.headerRowText) }><b>Software process</b></Text>
                    <FlexRow spacing="6">
                        <IconButton icon={ goFromPoint } color="gray50" onClick={ () => null }/>
                        <IconButton icon={ arrowExpandIcon } color="gray50" onClick={ () => null }/>
                    </FlexRow>
                </FlexRow>
                <FlexRow cx={ cx(css.levelRow) }>
                    <Text fontSize="14" lineHeight="24" font="sans" cx={ cx(css.rowText) }>Current Level: Advanced</Text>
                    <IconButton icon={ infoLogo } color="gray50" onClick={ () => null }/>
                </FlexRow>
                <FlexRow cx={ cx(css.descriptionRow) }>
                    <Text fontSize="12" lineHeight="18" font="sans" color='gray60' cx={ cx(css.rowText) }>At this level, user can understand the main points of clear texts in standard language.</Text>
                </FlexRow>
                <BigBattery rating={ rating } setRating={ setRating }/>
                <FlexRow cx={ css.iconButtonsRow }>
                    <Button cx={ css.iconBtn } icon={ heartIconFilled } fill='light' color={ isFavorite ? 'red' : 'gray50' } onClick={ () => setIsFavorite((prev) => !prev) }/>
                    <Button cx={ css.iconBtn } icon={ recommendedIcon } fill='light' color={ isRecommended ? 'green' : 'gray50' } onClick={ () => setIsRecommended((prev) => !prev) }/>
                    <Button cx={ css.iconBtn } icon={ noSkillIcon } fill='light' color="gray50" onClick={ () => setRating('NoSkill') }/>
                    <Button cx={ css.iconBtn } icon={ noActiveIcon } fill='light' color="gray50" onClick={ () => setRating('NA') }/>
                </FlexRow>
                <div className={ css.infoBlock }>
                    <FlexRow spacing="6" cx={ css.infoBlockRow } >
                        <IconContainer cx={ css.infoItem } icon={ doneIcon } />
                        <Text cx={ css.infoItem } color="gray80">Last updated</Text>
                        <Text cx={ css.infoItem } color="gray60">on Dec 10, 2019</Text>
                    </FlexRow>
                    <FlexRow spacing="6" cx={ css.infoBlockRow }>
                        <IconContainer cx={ css.infoItem } icon={ medalLogo } />
                        <Text cx={ css.infoItem } color="gray80">Confirmed by Assessment</Text>
                        <Text cx={ css.infoItem } color="gray60">on Jun 6, 2020</Text>
                    </FlexRow>
                    <FlexRow spacing="6" cx={ css.infoBlockRow }>
                        <IconContainer cx={ css.infoItem } icon={ doneIcon } />
                        <Text cx={ css.infoItem } color="gray80">Last updated</Text>
                        <Text cx={ css.infoItem } color="gray60">on Dec 10, 2019</Text>
                    </FlexRow>
                </div>
            </DropdownContainer>
        );
    };

    const TargetBody = React.forwardRef((props, ref) => {
        return (
            <FlexRow ref={ ref } cx={ cx(css.targetBodyContainer) } size="30">
                <IconContainer icon={ isFavorite ? heartIconFilled : heartIconOutline } color={ isFavorite ? 'red' : 'gray50' }/>
                <SmallBattery rating={ rating }/>
                <Text cx={ cx(css.skillText) } fontSize="14" lineHeight="18" font="sans">{ skillText }</Text>
            </FlexRow>
        );
    });


    const renderTarget = (props: IDropdownToggler) => {
        return (
            <div { ...props }>
                {
                    props.isOpen
                        ? <TargetBody/>
                        : <Tooltip trigger="hover" content={ <h1>Rendered content</h1> } placement="top" color="white">
                            <TargetBody ref={ targetBodyRef }/>
                        </Tooltip>
                }
            </div>
        );
    };

    return (
        <div style={ { padding: '3rem 1rem 0' } }>
            <Dropdown
                renderBody={ (props) => renderDropdownBody(props) }
                renderTarget={ (props: IDropdownToggler) => renderTarget(props) }
                closeOnTargetClick={ true }
                placement="bottom-start"
                modifiers={ [{ name: 'offset', options: { offset: [0, 6] } }] }
            />
        </div>
    );
};