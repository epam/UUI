import React, { useState } from 'react';
import css from './SkillsBatteryPopover.module.scss';
import { SmallBattery } from './components/SmallBattery';
import { BigBattery } from './components/BigBattery';
import { ISkillLevel, IInnerSkill, ISkill } from './utils';
import {
    Button, Dropdown, FlexRow, Text, DropdownContainer, IconContainer, IconButton, TextInput,
} from '@epam/promo';
import { cx, DropdownBodyProps, IDropdownToggler } from '@epam/uui-core';
import { getDateInFormat, getLevel, getLevelDescription } from './utils';
import { ReactComponent as heartIconOutline } from '@epam/assets/icons/common/fav-rates-favorite-outline-18.svg';
import { ReactComponent as heartIconFilled } from '@epam/assets/icons/common/fav-rates-favorite-18.svg';
import { ReactComponent as arrowExpandIcon } from './icons/navigation-arrows_expand-18.svg';
import { ReactComponent as goFromPoint } from './icons/Logo.svg';
import { ReactComponent as noSkillIcon } from './icons/no-skill-18.svg';
import { ReactComponent as noActiveIcon } from './icons/no-active-18.svg';
import { ReactComponent as recommendedIcon } from './icons/recommended-18.svg';
import { ReactComponent as infoLogo } from './icons/notification-info-outline-10.svg';

interface ISkillsBatteryProps {
    data: ISkill;
}

export function SkillsBatteryPopover(props: ISkillsBatteryProps) {
    const targetBodyRef = React.createRef();
    const [isFavorite, setIsFavorite] = useState<IInnerSkill>(props.data?.options.isProfile);
    const [isRecommended, setIsRecommended] = useState<IInnerSkill>(props.data?.options.isRecommended);
    const [level, setLevel] = useState<ISkillLevel>(props.data?.level);
    const [comment, setComment] = useState(props.data?.comment);

    const renderDropdownBody = (bodyProps: DropdownBodyProps) => {
        return (
            <DropdownContainer cx={ cx(css.dropContainer, css.uuiThemePromo) } { ...bodyProps }>
                <FlexRow cx={ cx(css.headerRow) }>
                    <Text fontSize="14" lineHeight="24" cx={ cx(css.headerRowText) }>
                        <b>{props.data?.caption}</b>
                    </Text>
                    <FlexRow columnGap="6">
                        <IconButton icon={ goFromPoint } color="gray50" onClick={ () => null } />
                        <IconButton icon={ arrowExpandIcon } color="gray50" onClick={ () => null } />
                    </FlexRow>
                </FlexRow>
                <FlexRow cx={ cx(css.levelRow) }>
                    <Text fontSize="14" lineHeight="24" cx={ cx(css.rowText) }>
                        Current Level:
                        {' '}
                        {getLevel(level)}
                    </Text>
                    <IconButton icon={ infoLogo } color="gray50" onClick={ () => null } />
                </FlexRow>
                <FlexRow cx={ cx(css.descriptionRow) }>
                    <Text fontSize="12" lineHeight="18" color="gray60" cx={ cx(css.rowText) }>
                        {getLevelDescription(level)}
                    </Text>
                </FlexRow>
                <BigBattery rating={ level } setRating={ setLevel } isExtended={ true } />
                <FlexRow cx={ css.iconButtonsRow }>
                    <Button
                        cx={ css.iconBtn }
                        icon={ isFavorite?.status ? heartIconFilled : heartIconOutline }
                        fill="light"
                        color={ isFavorite?.status ? 'red' : 'gray' }
                        onClick={ () => setIsFavorite((prev) => ({ ...prev, status: !prev.status })) }
                    />
                    <Button
                        cx={ css.iconBtn }
                        icon={ recommendedIcon }
                        fill="light"
                        color={ isRecommended?.status ? 'green' : 'gray' }
                        onClick={ () => setIsRecommended((prev) => ({ ...prev, status: !prev.status })) }
                    />
                    <Button cx={ css.iconBtn } icon={ noSkillIcon } fill="light" color="gray" onClick={ () => setLevel('NoSkill') } />
                    <Button cx={ css.iconBtn } icon={ noActiveIcon } fill="light" color="gray" onClick={ () => setLevel('NA') } />
                </FlexRow>
                <div className={ css.infoBlock }>
                    {Object.entries(props?.data.options).map((val, index) => (
                        <FlexRow key={ `${index}-option` } columnGap="6" cx={ css.infoBlockRow }>
                            <IconContainer cx={ css.infoItem } icon={ val[1].icon } />
                            <Text cx={ css.infoItem } color="gray80">
                                {val[1].prefix}
                            </Text>
                            <Text cx={ css.infoItem } color="gray60">
                                {getDateInFormat(val[1].date)}
                            </Text>
                        </FlexRow>
                    ))}
                </div>
                <TextInput value={ comment } onValueChange={ setComment } placeholder="Click to leave a comment..." mode="cell" size="30" />
            </DropdownContainer>
        );
    };

    function TargetBody(props: { isOpen: boolean; data: ISkill; isFavorite: IInnerSkill; level: ISkillLevel } & React.RefAttributes<unknown>) {
        return (
            <FlexRow ref={ props.ref } cx={ cx([css.targetBodyContainer, { [css.targetBodyContainerHover]: props.isOpen }]) } size="30">
                <IconContainer icon={ props.isFavorite?.status ? heartIconFilled : heartIconOutline } style={ props.isFavorite?.status && { fill: '#DB3A1A' } } />
                <SmallBattery rating={ props.level } />
                <Text cx={ cx(css.skillText) } fontSize="14" lineHeight="18">
                    {props.data?.caption}
                </Text>
                {Object.entries(props?.data.options).map((val) => (
                    <IconContainer cx={ css.infoItem } style={ { fill: `${val[1].activeColor}` } } icon={ val[1].icon } />
                ))}
            </FlexRow>
        );
    }

    const renderTarget = (targetProps: IDropdownToggler) => {
        return (
            <div { ...targetProps }>
                <TargetBody ref={ targetBodyRef } isOpen={ targetProps.isOpen } data={ props.data } isFavorite={ isFavorite } level={ level } />
            </div>
        );
    };

    return (
        <div className={ cx(css.wrapper, css.uuiThemePromo) }>
            <Dropdown
                renderBody={ (bodyProps) => renderDropdownBody(bodyProps) }
                renderTarget={ (targetProps: IDropdownToggler) => renderTarget(targetProps) }
                closeOnMouseLeave="boundary"
                openOnHover={ true }
                placement="bottom-start"
                modifiers={ [{ name: 'offset', options: { offset: [0, 6] } }] }
            />
        </div>
    );
}
