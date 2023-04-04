import * as React from "react";
import { DocBuilder, onClickDoc } from "@epam/uui-docs";
import { AnchorProps } from "@epam/uui-components";
import { DefaultContext } from "../../docs";
import { Anchor, Avatar, FlexCell, FlexRow, Panel, Text } from "@epam/promo";
import css from './anchor.scss';

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
                            <FlexRow alignItems="center" spacing="12">
                                <Avatar
                                    size="48"
                                    alt="avatar"
                                    img="https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50"
                                    cx={ css.image }
                                />

                                <FlexCell width="100%">
                                    <Text cx={ css.text } lineHeight="24" fontSize="16" color="gray80">John Doe</Text>
                                    <Text cx={ css.text } lineHeight="18" fontSize="12" color="gray60">Corporate Function Management | L3</Text>
                                </FlexCell>
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
