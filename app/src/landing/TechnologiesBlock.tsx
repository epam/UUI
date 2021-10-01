import * as React from 'react';
import { FlexRow, IconButton } from '@epam/promo';
import * as css from './TechnologiesBlock.scss';
import * as cssModulesIcon from '../icons/css-modules-logo.inkscape.svg';
import * as sassIcon from '../icons/sass.svg';
import * as tsIcon from '../icons/typescript-icon.svg';
import * as reactIcon from '../icons/react.svg';
import * as craIcon from '../icons/create.svg';
import * as webpackIcon from '../icons/webpack.svg';
import * as jestIcon from '../icons/jest.svg';

const technologies = [
    { icon: cssModulesIcon, link: 'https://github.com/css-modules/css-modules', label: 'CSS Modules' },
    { icon: sassIcon, link: 'https://sass-lang.com', label: 'SASS' },
    { icon: tsIcon, link: 'https://www.typescriptlang.org', label: 'Typescript' },
    { icon: reactIcon, link: 'https://reactjs.org', label: 'React' },
    { icon: craIcon, link: 'https://create-react-app.dev', label: 'Create React App' },
    { icon: webpackIcon, link: 'https://webpack.js.org', label: 'Webpack' },
    { icon: jestIcon, link: 'https://jestjs.io', label: 'Jest' },
];

export class TechnologiesBlock extends React.Component {
    render() {
        return (
            <div className={ css.layout } >
                <div className={  css.wrapper } >
                    <FlexRow cx={ css.technologies } >
                        { technologies.map(({ icon, label, link }) => (
                            <IconButton
                                rawProps={{ 'aria-label': label, rel: 'noreferrer noopener' }}
                                key={ label }
                                icon={ icon }
                                target='_blank'
                                href={ link }
                            />
                        )) }
                    </FlexRow>
                </div>
            </div>
        );
    }
}