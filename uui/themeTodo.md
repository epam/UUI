# TODO
- [x] Button/TextInput/TextArea fontSize and lineHeight - check can we provide it via cx, if yes - remove
- [x] Button and IconButton: old loveship colors, what we will do with them? - check what is used in learn?
- [x] TextInput/PickerInput(где еще есть) (suffix and prefix) deprecated? - выпиливаем, спросить в UUI чатике кто использует
- [ ] In uui we need approach to change icons
- [ ] In FilterRangeDatePickerBody.tsx (in 'promo' now) we would like to use RangeDatePicker component in footer, and get rid of copy-paste.
- [x] check border in focus (new design in loveship-figma without shadow) - убираем аутлайны в лавшипе у кнопки
- [x] In loveship/types Interface EditMode: mode?: 'form' | 'inline' - ? | 'cell' | 'none' - ?; - leave only in both skins for TextArea and TextInput
- [ ] Remade SearchInput in PickerInput to fit Figma UUI3 styles.
- [ ] in uui-core/helpers/withMods.ts removed inherited IHasCX, because DatePicker no need cx props, but it has inputCx and BodyCx, so we need to remade it
- [ ] Do we need light/dark theme in Loveship Checkbox component? 
- [ ] PgeButton (Paginator) colors in figma and in our site are different. Where are the correct set?
- [ ] Tag and LinkButton in figma have only one color, but we have a lot of them on our previous version.
- [ ] In components which use other uuiComponent, like UuiButton, in classes has that component specific classes (UuiTag has button-primary, root, mode-solid size_... etc)

