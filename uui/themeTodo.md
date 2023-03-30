# TODO
- [ ] In FilterRangeDatePickerBody.tsx (in 'promo' now) we would like to use RangeDatePicker component in footer, and get rid of copy-paste.
- [ ] Remade SearchInput in PickerInput to fit Figma UUI3 styles.
- [ ] PgeButton (Paginator) colors in figma and in our site are different. Where are the correct set?

- [ ] WithMods function - need to rework:
     1) case when we need to redefine some variable typo, for example - color.
     2) case when we need to add some specific for skin typing
     3) we removed inherited IHasCX, because DatePicker no need cx props, but it has inputCx and BodyCx, so we need to remade it
- [ ] подумать нужен ли нам Text компонент в UUI
- [ ] NotificationCard: we need to remove the semantic varieties of notificationCards from skins and re-export them from uui when we get rid of hanging the theme directly in skins
- [ ] IconContainer: remove colors for Promo will be - semantic colors + default + secondary, for Loveship - semantic + 'night400'(used in DataPickerRow) + 'default' + 'secondary'

# TODO for UUI package
### Panel
- [ ] discuss background props
### PickerInput
- [ ] DataPickerBody renderNotFound promo has been modified with different logic than loveship
### MainMenu
- [ ] Discuss mainMenu tokens, from whom should we inherit menu tokens?

