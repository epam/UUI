import React from "react";
import * as css from "./Basic.example.scss";
import { Anchor, FlexRow, IconContainer, Text } from "@epam/promo";
import { ReactComponent as EPAMIcon } from "../../../icons/EPAM.svg";
import { ReactComponent as GitIcon } from "../../../icons/git-branch-18.svg";

export default function BasicExample() {
    return (
        <div>
            <div>
                <div className={ css.layout }>
                    <FlexRow cx={ css.footer }>
                        <Anchor rawProps={ { tabIndex: -1, "aria-label": "EPAM" } } href={ `https://www.epam.com` } target="_blank">
                            <IconContainer icon={ EPAMIcon }/>
                        </Anchor>
                        <Text color="gray60" font="sans" fontSize="14" lineHeight="24" cx={ css.copyright }>© 2022 EPAM Systems. All Rights reserved</Text>
                        <Anchor cx={ css.linkContainer } href={ 'https://github.com/epam/UUI' } target="_blank" onClick={ () => null }>
                            <IconContainer icon={ GitIcon } color="white"/>
                            <Text font="sans-semibold" fontSize="14" lineHeight="24" cx={ css.linkCaption }>Open Git</Text>
                        </Anchor>
                    </FlexRow>
                </div>
            </div>

            <div className={ css.navPage }>
                <div className={ css.navCards }>
                    <Anchor link={ { pathname: '/demo', query: { id: 'table' } } } >
                        <div className={ css.navCard } style={ { backgroundImage: `url(${ '/static/images/DemoTable.png' })` } }>
                            <Text font="sans-semibold" lineHeight="30" fontSize="24" cx={ css.navCaption }>{ 'Demo Table' }</Text>
                        </div>
                    </Anchor>
                </div>
            </div>
        </div>
    );
}