import { Panel, RichTextView, IconContainer } from '@epam/uui';
import { ReactComponent as UuiPromoImage } from '../icons/uui-promo-image.svg';
import css from './MainPage.module.scss';
import { useUuiContext } from '@epam/uui-core';
import { TApi, TMainPageLink } from '../data/apiDefinition';
import { TAppContext } from '../data/appContext';
import { useEffect, useState } from 'react';

export const MainPage = () => {
    return (
        <main>
            <div className={css.bgImg}>
                <IconContainer icon={UuiPromoImage} />
            </div>
            <Panel cx={css.mainPanel}>
                <RichTextView size="14">
                    <h3>Welcome to UUI template app</h3>
                    <Links />
                </RichTextView>
            </Panel>
        </main>
    );
};

function Links() {
    const [links, setLinks] = useState<TMainPageLink[]>([]);
    const { api } = useUuiContext<TApi, TAppContext>();
    const loadLinksFn = api.loadLinksForMainPage;

    useEffect(() => {
        loadLinksFn()
            .then((res) => {
                setLinks(res);
            })
            .catch((err) => console.error(err));
    }, [loadLinksFn]);

    return (
        <>
            {links.map((value) => {
                const { label, link, linkLabel } = value;
                return (
                    <p key={label}>
                        {label}
                        <a href={link}>{linkLabel}</a>
                    </p>
                );
            })}
        </>
    );
}
