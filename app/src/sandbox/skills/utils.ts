import { FunctionComponent, SVGProps } from 'react';
import { uuiDayjs } from '../../helpers';

export type ISkillLevel = 1 | 2 | 3 | 4 | 'NA' | 'NoSkill' | 'Rank';

export interface ISmallBatteryProps {
    rating: ISkillLevel;
}

type ColorValueHex = `#${string}`;

export interface IInnerSkill {
    icon: FunctionComponent<SVGProps<SVGSVGElement>>;
    activeColor: ColorValueHex;
    status: boolean;
    prefix: string;
    date: Date;
}

export interface ISkill {
    caption: string;
    level: ISkillLevel;
    comment: string;
    description: string;
    options: {
        isProfile: IInnerSkill;
        isOutdated: IInnerSkill;
        isConfirmed: IInnerSkill;
        isRecommended: IInnerSkill;
    };
    lastUpdated: Date;
}

export const getDateInFormat = (date: Date) => uuiDayjs.dayjs(date).format('MMM DD, YYYY');

export const getLevel = (level: ISkillLevel): string => {
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
        case 'NoSkill':
            return 'No skill';
        case 'Rank':
            return 'Rank';
        default:
            return null;
    }
};

export const getLevelDescription = (level: ISkillLevel): string => {
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
        case 'NoSkill':
            return 'No skill';
        case 'Rank':
            return 'Rank description';
        default:
            return null;
    }
};
