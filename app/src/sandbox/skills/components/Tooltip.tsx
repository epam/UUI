import React from 'react';
import { FlexRow, Text, IconContainer } from '@epam/promo';
import { getDateInFormat, getLevel } from '../utils';
import { ISkill, ISkillLevel } from '../utils';
import css from './../SkillsBatteryPopover.module.scss';

interface ITooltip {
    level: ISkillLevel;
    data: ISkill;
}

const Tooltip: React.FC<ITooltip> = ({ level, data }) => {
    return (
        <div className={ css.tooltipContainer }>
            <FlexRow columnGap="6" cx={ css.tooltipHeader }>
                <Text cx={ css.tooltipHeaderItem } color="gray60">
                    Current level:
                </Text>
                <Text cx={ css.tooltipHeaderItem } color="gray5">
                    {getLevel(level)}
                </Text>
            </FlexRow>
            {Object.entries(data.options).map((val, index) => (
                <FlexRow key={ `${index}-tooltip` } columnGap="6" cx={ css.tooltipBlockRow }>
                    <IconContainer cx={ css.tooltipItem } icon={ val[1].icon } style={ { fill: val[1].activeColor } } />
                    <Text cx={ css.tooltipItem } color="gray60">
                        {val[1].prefix}
                    </Text>
                    <Text cx={ css.tooltipItem } color="gray5">
                        {getDateInFormat(val[1].date)}
                    </Text>
                </FlexRow>
            ))}
        </div>
    );
};

export { Tooltip };
