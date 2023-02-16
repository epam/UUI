# TODO
- [-] Button/TextInput/TextArea fontSize and lineHeight - check can we provide it via cx, if yes - remove
- [-] Button and IconButton: old loveship colors, what we will do with them? - check what is used in learn/level up?
- [-] TextInput/PickerInput(где еще есть) (suffix and prefix) deprecated? - ask in UUI chat, if somebody use it, remove if not
- [-] In uui we need approach to change icons(for first release, leave hardcoded icons)
- [ ] In FilterRangeDatePickerBody.tsx (in 'promo' now) we would like to use RangeDatePicker component in footer, and get rid of copy-paste.
- [-] check border in focus (new design in loveship-figma without shadow) - убираем аутлайны в лавшипе у кнопки
- [-] In loveship/types Interface EditMode: mode?: 'form' | 'inline' - ? | 'cell' | 'none' - ?; - leave only in both skins for TextArea and TextInput
- [ ] Remade SearchInput in PickerInput to fit Figma UUI3 styles.
- [-] Do we need light/dark theme in Loveship Checkbox component? - remove 'theme' prop, make dark theme for loveship for such cases(not in priority)
- [ ] PgeButton (Paginator) colors in figma and in our site are different. Where are the correct set?
- [-] LinkButton in figma have only one color, but we have a lot of them on our previous version - make semantic colors for both skins, in loveship leave only semantic + night600(on skin level).
- [-] Tag leave all colors set only in loveship via loveship css mods
- [-] Tag: do we need fill (solid | white | none) in loveship (now it's present) - leave only in loveship
- [-] remove carbon color from all components
- [ ] Badge: leave all color set for both skins, in uui only semantic
- [ ] Badge: fill: solid | semitransparent | transparent for both skins, fill: white only in loveship
- [ ] Badge: square leave only in loveship
- [-] Badge: подумать насчет дефолтных значений для цветов, тут 2 варианта: либо мы придумываем какие дефолты ставить, либо делаем color обязательным
- [-] theme.css - maybe convert it into scss?
- [-] We deprecated line-height font-size v-padding in loveship, is it Ok (TextArea as example)?
- [-] move skins themes into @epam/assets and make it scss

- [ ] WithMods function - need to rework:
     1) case when we need to redefine some variable typo, for example - color.
     2) case when we need to add some specific for skin typing
     3) we removed inherited IHasCX, because DatePicker no need cx props, but it has inputCx and BodyCx, so we need to remade it
- [ ] LabeledInput: remove color prop from Loveship & Promo
- [ ] Do we need semantic color class in components or only current theme color class?
- [ ] подумать нужен ли нам Text компонент в UUI
- [ ] UuiTextPlaceholder подумать нужны ли нам в UUI все цвета (вся палитра) в loveship и gray10 в promo. Сейчас оставили только один стандартный gray40.
- [ ] NotificationCard: we need to remove the semantic varieties of notificationCards from skins and re-export them from uui when we get rid of hanging the theme directly in skins

# TODO for UUI package
### Panel
- [ ] discuss background props
### PickerInput
- [ ] DataPickerBody renderNotFound promo has been modified with different logic than loveship

