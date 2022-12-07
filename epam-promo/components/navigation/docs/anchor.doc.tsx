import * as React from "react";
import { DocBuilder, onClickDoc } from "@epam/uui-docs";
import { AnchorProps } from "@epam/uui-components";
import { DefaultContext } from "../../../docs";
import { Text } from "../../typography";
import { Anchor } from "../Anchor";
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
                        <Text cx={ css.textStyle } lineHeight="30" fontSize="16">Click Me</Text>,
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
