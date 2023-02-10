import * as React from 'react';
import { withMods } from "@epam/uui-core";
import { TextPlaceholderProps, TextPlaceholder as UuiTextPlaceholder } from "@epam/uui";

const applyTextPlaceholderMods = () => ['uui-theme-loveship'];

export const TextPlaceholder = withMods<TextPlaceholderProps>(UuiTextPlaceholder, applyTextPlaceholderMods);
