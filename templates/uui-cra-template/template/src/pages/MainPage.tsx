import React from 'react';
import { Panel, RichTextView, IconContainer } from '@epam/promo';
import { ReactComponent as UuiPromoImage } from '../icons/uui-promo-image.svg';
import css from './MainPage.module.scss';

export const MainPage = () => {
    return (
        <>
            <div className={ css.bgImg }>
                <div>
                    <IconContainer icon={ UuiPromoImage } />
                </div>
            </div>
            <Panel cx={ css.mainPanel } background='white'>
                <RichTextView size="14">
                    <h3>Welcome to UUI template app</h3>
                    <p>UUI docs: <a href="https://uui.epam.com/">uui.epam.com</a></p>
                    <p>Git: <a href="https://github.com/epam/uui">github.com/epam/uui</a></p>
                    <p>App powered by: <a href="https://create-react-app.dev/">Create React App</a></p>
                </RichTextView>
            </Panel>
        </>
    );
};
