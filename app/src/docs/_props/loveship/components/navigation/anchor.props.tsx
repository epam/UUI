import * as React from "react";
import css from './anchor.scss';
import { DocBuilder, onClickDoc } from "@epam/uui-docs";
import { AnchorProps, FlexSpacer, IconContainer } from "@epam/uui-components";
import { DefaultContext } from "../../docs";
import { Text, Anchor, FlexCell,  FlexRow, Panel } from "@epam/loveship";
import { ReactComponent as gitIcon } from '@epam/assets/icons/common/social-network-github-18.svg';
import { ReactComponent as PinterestIcon } from '@epam/assets/icons/common/social-network-pinterest-18.svg';
import { ReactComponent as InstagramIcon } from '@epam/assets/icons/common/social-network-instagram-18.svg';
import { ReactComponent as InfoIcon } from '@epam/assets/icons/common/table-info-outline-18.svg';
import { ReactComponent as GearIcon } from '@epam/assets/icons/common/action-settings-12.svg';

const AnchorDoc = new DocBuilder<AnchorProps>({ name: 'Anchor', component: Anchor })
    .implements([onClickDoc])
    .prop("href", {
            examples: [
                { value: 'https://uui.epam.com', isDefault: true },
                { value: 'https://epam.com' },
            ],
        },
    )
    .prop("children", {
            examples: [
                {
                    value: [
                        <Panel cx={ css.panel }>
                            <FlexRow alignItems="center" spacing="6" cx={ css.iconRow }>
                                <IconContainer icon={ gitIcon } cx={ css.icon } />
                                <IconContainer icon={ PinterestIcon } cx={ css.icon } />
                                <IconContainer icon={ InstagramIcon } cx={ css.icon } />
                                <FlexSpacer/>
                                <IconContainer icon={ InfoIcon } cx={ css.icon } />
                            </FlexRow>
                            <FlexRow alignItems="center" spacing="12" margin='12'>
                                <FlexCell width="100%">
                                    <Text cx={ css.text } lineHeight="24" fontSize="16" color="night800">John Doe</Text>
                                    <Text cx={ css.text } lineHeight="18" fontSize="12" color="night600">Corporate Function Management | L3</Text>
                                </FlexCell>
                            </FlexRow>
                            <FlexRow padding='12' spacing='6' cx={ css.footer }>
                                <IconContainer icon={ GearIcon } cx={ css.icon } />
                                <FlexSpacer />
                                <Text size='36' font='sans' color='night600'>98%</Text>
                            </FlexRow>
                        </Panel>,
                    ], isDefault: true,
                },
            ],
        },
    )
    .prop("target", { examples: ["_blank"] })
    .prop("isDisabled", {
        examples: [
            { value: true },
            { value: false, isDefault: true },
        ],
    })
    .withContexts(DefaultContext);

export default AnchorDoc;
