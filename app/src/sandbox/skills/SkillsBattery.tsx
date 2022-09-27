import React, { useState } from "react";
import dayjs from "dayjs";
import { SmallBattery } from "./smallBattery/SmallBattery";
import { Button, Dropdown, FlexRow, Tooltip, Text, DropdownContainer, IconContainer, IconButton, TextInput } from "@epam/promo";
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
import { BigBattery } from "./bigBattery/BigBattery";
import { IInnerSkill, ISkill, ISkillLevel } from "./index";


const getDateInFormat = (date: Date) => dayjs(date).format('MMM DD, YYYY');

const getLevel = (level: ISkillLevel): string => {
    switch (level) {
        case 1:
            return 'Novice';
        case 2:
            return 'Intermediate';
        case 3:
            return 'Advanced';
        case 4:
            return 'Expert';
        case 'NA':
            return 'Not check';
        case "NoSkill":
            return 'No skill';
        case 'Rank':
            return 'Rank';
        default:
            return null;
    }
};

const getLevelDescription = (level: ISkillLevel): string => {
    switch (level) {
        case 1:
            return 'Novice description Lorem ipsum dolor sit amet.';
        case 2:
            return 'Intermediate description Lorem ipsum dolor sit amet.';
        case 3:
            return 'Advanced description Lorem ipsum dolor sit amet.';
        case 4:
            return 'Expert  description Lorem ipsum dolor sit amet.';
        case 'NA':
            return 'Not check';
        case "NoSkill":
            return 'No skill';
        case 'Rank':
            return 'Rank description';
        default:
            return null;
    }
};

interface ISkillsBatteryProps {
    data: ISkill;
}

export const SkillsBattery = (props: ISkillsBatteryProps) => {
    const targetBodyRef = React.createRef();
    const [isFavorite, setIsFavorite] = useState<IInnerSkill>(props.data?.options.isFavourite);
    const [isRecommended, setIsRecommended] = useState<IInnerSkill>(props.data?.options.isRecommended);
    const [level, setLevel] = useState<ISkillLevel>(props.data?.level);
    const [skillText, setSkillText] = useState(props.data?.caption);
    const [comment, setComment] = useState(props.data?.comment);


    const renderDropdownBody = (bodyProps: DropdownBodyProps) => {
        return (
            <DropdownContainer cx={ cx(css.dropContainer) } { ...bodyProps }>
                <FlexRow cx={ cx(css.headerRow) }>
                    <Text fontSize="14" lineHeight="24" font="sans" cx={ cx(css.headerRowText) }><b>{ skillText }</b></Text>
                    <FlexRow spacing="6">
                        <IconButton icon={ goFromPoint } color="gray50" onClick={ () => null }/>
                        <IconButton icon={ arrowExpandIcon } color="gray50" onClick={ () => null }/>
                    </FlexRow>
                </FlexRow>
                <FlexRow cx={ cx(css.levelRow) }>
                    <Text fontSize="14" lineHeight="24" font="sans" cx={ cx(css.rowText) }>Current Level: { getLevel(level) }</Text>
                    <IconButton icon={ infoLogo } color="gray50" onClick={ () => null }/>
                </FlexRow>
                <FlexRow cx={ cx(css.descriptionRow) }>
                    <Text fontSize="12" lineHeight="18" font="sans" color="gray60" cx={ cx(css.rowText) }>{ getLevelDescription(level) }</Text>
                </FlexRow>
                <BigBattery rating={ level } setRating={ setLevel } isExtended={ true }/>
                <FlexRow cx={ css.iconButtonsRow }>
                    <Button cx={ css.iconBtn } icon={ heartIconFilled } fill="light" color={ isFavorite?.status ? 'red' : 'gray50' } onClick={ () => setIsFavorite((prev) => ({ ...prev, status: !prev.status })) }/>
                    <Button cx={ css.iconBtn } icon={ recommendedIcon } fill="light" color={ isRecommended?.status ? 'green' : 'gray50' } onClick={ () => setIsRecommended((prev) => ({ ...prev, status: !prev.status })) }/>
                    <Button cx={ css.iconBtn } icon={ noSkillIcon } fill="light" color="gray50" onClick={ () => setLevel('NoSkill') }/>
                    <Button cx={ css.iconBtn } icon={ noActiveIcon } fill="light" color="gray50" onClick={ () => setLevel('NA') }/>
                </FlexRow>
                <div className={ css.infoBlock }>
                    { Object.entries(props?.data.options).map((val, index) => (
                        <FlexRow key={ `${ index }-option` } spacing="6" cx={ css.infoBlockRow }>
                            <IconContainer cx={ css.infoItem } icon={ val[1].icon }/>
                            <Text cx={ css.infoItem } color="gray80">{ val[1].prefix }</Text>
                            <Text cx={ css.infoItem } color="gray60">{ getDateInFormat(val[1].date) }</Text>
                        </FlexRow>
                    )) }
                </div>
                <TextInput value={ comment } onValueChange={ setComment } placeholder="Click to leave a comment..." mode="cell" size="30"/>
            </DropdownContainer>
        );
    };

    const TargetBody = React.forwardRef((bodyProps, ref) => {
        return (
            <FlexRow ref={ ref } cx={ cx(css.targetBodyContainer) } size="30">
                <IconContainer icon={ isFavorite?.status ? heartIconFilled : heartIconOutline } color={ isFavorite?.status ? 'red' : 'gray50' }/>
                <SmallBattery rating={ level }/>
                <Text cx={ cx(css.skillText) } fontSize="14" lineHeight="18" font="sans">{ skillText }</Text>
                { Object.entries(props?.data.options).map((val) => (
                    <IconContainer cx={ css.infoItem } icon={ val[1].icon } color={ val[1].activeColor }/>
                )) }
            </FlexRow>
        );
    });

    const getTooltipContent = () => {
        return (
            <div className={ css.tooltipContainer }>
                <FlexRow spacing="6" cx={ css.tooltipHeader }>
                    <Text cx={ css.tooltipHeaderItem } color="gray60">Current level:</Text>
                    <Text cx={ css.tooltipHeaderItem } color="gray5">{ getLevel(level) }</Text>
                </FlexRow>
                { Object.entries(props?.data.options).map((val, index) => (
                    <FlexRow key={ `${ index }-tooltip` } spacing="6" cx={ css.tooltipBlockRow }>
                        <IconContainer cx={ css.tooltipItem } icon={ val[1].icon }/>
                        <Text cx={ css.tooltipItem } color="gray60">{ val[1].prefix }</Text>
                        <Text cx={ css.tooltipItem } color="gray5">{ getDateInFormat(val[1].date) }</Text>
                    </FlexRow>
                )) }
            </div>
        );
    };


    const renderTarget = (targetProps: IDropdownToggler) => {
        return (
            <div { ...targetProps }>
                {
                    targetProps.isOpen
                        ? <TargetBody/>
                        : <Tooltip trigger="hover" content={ getTooltipContent() } placement="top">
                            <TargetBody ref={ targetBodyRef }/>
                        </Tooltip>
                }
            </div>
        );
    };

    return (
        <div style={ { padding: '3rem 1rem 0' } }>
            <Dropdown
                renderBody={ (bodyProps) => renderDropdownBody(bodyProps) }
                renderTarget={ (targetProps: IDropdownToggler) => renderTarget(targetProps) }
                closeOnTargetClick={ true }
                placement="bottom-start"
                modifiers={ [{ name: 'offset', options: { offset: [0, 6] } }] }
            />
        </div>
    );
};
