import * as React from 'react';
import { FlexRow, IconButton } from '@epam/promo';
import css from './TechnologiesBlock.scss';
import { ReactComponent as CssModulesIcon } from '../icons/css-modules-logo.inkscape.svg';
import { ReactComponent as SassIcon } from '../icons/sass.svg';
import { ReactComponent as TsIcon } from '../icons/typescript-icon.svg';
import { ReactComponent as ReactIcon } from '../icons/react.svg';
import { ReactComponent as CraIcon } from '../icons/create.svg';
import { ReactComponent as WebpackIcon } from '../icons/webpack.svg';
import { ReactComponent as JestIcon } from '../icons/jest.svg';

const technologies = [
    { icon: CssModulesIcon, link: 'https://github.com/css-modules/css-modules', label: 'CSS Modules' },
    { icon: SassIcon, link: 'https://sass-lang.com', label: 'SASS' },
    { icon: TsIcon, link: 'https://www.typescriptlang.org', label: 'Typescript' },
    { icon: ReactIcon, link: 'https://reactjs.org', label: 'React' },
    { icon: CraIcon, link: 'https://create-react-app.dev', label: 'Create React App' },
    { icon: WebpackIcon, link: 'https://webpack.js.org', label: 'Webpack' },
    { icon: JestIcon, link: 'https://jestjs.io', label: 'Jest' },
];

export class TechnologiesBlock extends React.Component {
    render() {
        return (
            <div className={ css.layout }>
                <div className={ css.wrapper }>
                    <FlexRow cx={ css.technologies }>
                        {technologies.map(({ icon, label, link }) => (
                            <IconButton rawProps={ { 'aria-label': label } } key={ label } icon={ icon } target="_blank" href={ link } />
                        ))}
                    </FlexRow>
                </div>
            </div>
        );
    }
}
