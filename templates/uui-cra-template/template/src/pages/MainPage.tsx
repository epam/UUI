import css from './MainPage.module.scss';
//
import { Panel, RichTextView, IconContainer } from '@epam/uui';
import { ReactComponent as UuiPromoImage } from '../icons/uui-promo-image.svg';

const links = [
    {
        label: 'UUI docs: ',
        link: 'https://uui.epam.com',
        linkLabel: 'uui.epam.com',
    },
    {
        label: 'Git: ',
        link: 'https://github.com/epam/uui',
        linkLabel: 'github.com/epam/uui',
    },
];

export const MainPage = () => {
    return (
        <main>
            <div className={css.bgImg}>
                <IconContainer icon={UuiPromoImage} />
            </div>
            <Panel cx={css.mainPanel}>
                <RichTextView size="14">
                    <h3>Welcome to UUI template app</h3>
                    {
                        links.map((value) => (
                            <p key={value.label}>
                                {value.label}
                                <a href={value.link}>{value.linkLabel}</a>
                            </p>
                        ))
                    }
                </RichTextView>
            </Panel>
        </main>
    );
};
