import React, { useState } from "react";
import { SmallBattery } from "./smallBattery/SmallBattery";
import { Button, Dropdown, FlexRow, LinkButton, Tooltip, Text, DropdownContainer, IconContainer, IconButton } from "@epam/promo";
import { cx, IDropdownToggler } from "@epam/uui-core";
import { DropdownBodyProps } from "@epam/uui-components";
import css from './SkillsBattery.scss';
import { ReactComponent as heartIconOutline } from '@epam/assets/icons/common/fav-rates-favorite-outline-18.svg';
import { ReactComponent as heartIconRed } from '@epam/assets/icons/common/fav-rates-favorite-18.svg';
import { ReactComponent as arrowExpandIcon } from '@epam/assets/icons/common/navigation-arrows_expand-24.svg';
import { BigBattery } from "./bigBattery/BigBattery";

export const SkillsBattery = () => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [rating, setRating] = useState(1);
    const [skillText, setSkillText] = useState('Software process');
    const targetBodyRef = React.createRef();

    const renderDropdownBody = (props: DropdownBodyProps) => {
        return (
            <DropdownContainer cx={ cx(css.dropContainer) }>
                <FlexRow cx={ cx(css.dropContainerRow) }>
                    <Text fontSize="14" lineHeight="24" font="sans"><b>{ skillText }</b></Text>
                    <FlexRow spacing="6">
                        <IconButton icon={ arrowExpandIcon } color="gray50" onClick={ () => null }/>
                        <IconButton icon={ arrowExpandIcon } color="gray50" onClick={ () => null }/>
                    </FlexRow>
                </FlexRow>
                <BigBattery rating={ rating } setRating={ setRating }/>
            </DropdownContainer>
        );
    };

    const TargetBody = React.forwardRef((props, ref) => {
        return (
            <FlexRow ref={ ref } cx={ cx(css.targetBodyContainer) } size="30">
                <IconContainer icon={ isFavorite ? heartIconRed : heartIconOutline } color={ isFavorite ? 'red' : 'gray50' }/>
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
            />
        </div>
    );
};