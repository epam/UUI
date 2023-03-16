# TODO
- [-] Button and IconButton: old loveship colors, what we will do with them? - check what is used in learn/level up?
- [-] TextInput/PickerInput(где еще есть) (suffix and prefix) deprecated? - ask in UUI chat, if somebody use it, remove if not
- [-] In uui we need approach to change icons(for first release, leave hardcoded icons)
- [ ] In FilterRangeDatePickerBody.tsx (in 'promo' now) we would like to use RangeDatePicker component in footer, and get rid of copy-paste.
- [ ] Remade SearchInput in PickerInput to fit Figma UUI3 styles.
- [-] Do we need light/dark theme in Loveship Checkbox component? - remove 'theme' prop, make dark theme for loveship for such cases(not in priority)
- [ ] PgeButton (Paginator) colors in figma and in our site are different. Where are the correct set?
- [-] Tag: do we need fill (solid | white | none) in loveship (now it's present) - leave only in loveship
- [-] Badge: подумать насчет дефолтных значений для цветов, тут 2 варианта: либо мы придумываем какие дефолты ставить, либо делаем color обязательным
- [-] app/src/demo/tables/filteredTable/FilteredTableFooter.tsx uses some components from promo and in loveship theme they work wrong.

- [ ] WithMods function - need to rework:
     1) case when we need to redefine some variable typo, for example - color.
     2) case when we need to add some specific for skin typing
     3) we removed inherited IHasCX, because DatePicker no need cx props, but it has inputCx and BodyCx, so we need to remade it
- [ ] подумать нужен ли нам Text компонент в UUI
- [ ] IconContainer: remove colors for Promo will be - semantic colors + default + secondary, for Loveship - semantic + 'night400'(used in DataPickerRow) + 'default' + 'secondary'

# TODO for UUI package
### Panel
- [ ] discuss background props
### PickerInput
- [ ] DataPickerBody renderNotFound promo has been modified with different logic than loveship
### MainMenu
- [ ] Discuss mainMenu tokens, from whom should we inherit menu tokens?

