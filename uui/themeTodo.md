# TODO
- [x] Button/TextInput/TextArea fontSize and lineHeight - check can we provide it via cx, if yes - remove
- [x] Button and IconButton: old loveship colors, what we will do with them? - check what is used in learn/level up?
- [x] TextInput/PickerInput(где еще есть) (suffix and prefix) deprecated? - ask in UUI chat, if somebody use it, remove if not
- [x] In uui we need approach to change icons(for first release, leave hardcoded icons)
- [ ] In FilterRangeDatePickerBody.tsx (in 'promo' now) we would like to use RangeDatePicker component in footer, and get rid of copy-paste.
- [x] check border in focus (new design in loveship-figma without shadow) - убираем аутлайны в лавшипе у кнопки
- [x] In loveship/types Interface EditMode: mode?: 'form' | 'inline' - ? | 'cell' | 'none' - ?; - leave only in both skins for TextArea and TextInput
- [ ] Remade SearchInput in PickerInput to fit Figma UUI3 styles.
- [x] Do we need light/dark theme in Loveship Checkbox component? - remove 'theme' prop, make dark theme for loveship for such cases(not in priority)
- [ ] PgeButton (Paginator) colors in figma and in our site are different. Where are the correct set?
- [x] LinkButton in figma have only one color, but we have a lot of them on our previous version - make semantic colors for both skins, in loveship leave only semantic + night600(on skin level).
- [x] Tag leave all colors set only in loveship via loveship css mods
- [x] Tag: do we need fill (solid | white | none) in loveship (now it's present) - leave only in loveship
- [x] remove carbon color from all components
- [ ] Badge: leave all color set for both skins, in uui only semantic
- [ ] Badge: fill: solid | semitransparent | transparent for both skins, fill: white only in loveship
- [ ] Badge: square leave only in loveship
- [x] Badge: подумать насчет дефолтных значений для цветов, тут 2 варианта: либо мы придумываем какие дефолты ставить, либо делаем color обязательным
- [x] theme.css - maybe convert it into scss?
- [x] We deprecated line-height font-size v-padding in loveship, is it Ok (TextArea as example)?
- [x] move skins themes into @epam/assets and make it scss
- [x] app/src/demo/tables/filteredTable/FilteredTableFooter.tsx uses some components from promo and in loveship theme they work wrong.

- [ ] WithMods function - need to rework:
     1) case when we need to redefine some variable typo, for example - color.
     2) case when we need to add some specific for skin typing
     3) we removed inherited IHasCX, because DatePicker no need cx props, but it has inputCx and BodyCx, so we need to remade it
- [ ] LabeledInput: remove color prop from Loveship & Promo
- [ ] Do we need semantic color class in components or only current theme color class?
- [ ] подумать нужен ли нам Text компонент в UUI
- [ ] skinContext in promo uses FilterItemBody, maybe move hook in another place?
- [ ] UuiTextPlaceholder подумать нужны ли нам в UUI все цвета (вся палитра) в loveship и gray10 в promo. Сейчас оставили только один стандартный gray40.
- [ ] NotificationCard: we need to remove the semantic varieties of notificationCards from skins and re-export them from uui when we get rid of hanging the theme directly in skins
- [ ] Alert: we need to remove the semantic varieties of Alert from skins and re-export them from uui when we get rid of hanging the theme directly in skins
- [ ] IconContainer: remove colors for Promo will be - semantic colors + default + secondary, for Loveship - semantic + 'night400'(used in DataPickerRow) + 'default' + 'secondary'
- [x] PickerToggler: single interface for all skins: "form" | "cell" | "inline"

# TODO for UUI package
### Panel
- [ ] discuss background props
### PickerInput
- [ ] DataPickerBody renderNotFound promo has been modified with different logic than loveship
### MainMenu
- [ ] Discuss mainMenu tokens, from whom should we inherit menu tokens?

