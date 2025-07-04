import { orderBy } from '@epam/uui-core';
import { DocItem } from '../_types/docItem';
import { ButtonDocItem } from '../Button.doc';
import { BadgeDocItem } from '../Badge.doc';
import { AlertDocItem } from '../Alert.doc';
import { CheckboxGroupDocItem } from '../CheckboxGroup.doc';
import { ControlGroupDocItem } from '../ControlGroup.doc';
import { DatePickerDocItem } from '../datePicker/DatePicker.doc';
import { DropdownDocItem } from '../Dropdown.doc';
import { DropdownMenuDocItem } from '../DropdownMenu.doc';
import { AccordionDocItem } from '../accordion/Accordion.doc';
import { AdaptivePanelDocItem } from '../AdaptivePanel.doc';
import { AnchorDocItem } from '../anchor/Anchor.doc';
import { AvatarDocItem } from '../Avatar.doc';
import { AvatarStackDocItem } from '../avatarStack/AvatarStack.doc';
import { BlockerDocItem } from '../Blocker.doc';
import { CheckboxDocItem } from '../Checkbox.doc';
import { PanelDocItem } from '../panel/Panel.doc';
import { FlexRowDocItem } from '../flexRow/FlexRow.doc';
import { FlexCellDocItem } from '../FlexCell.doc';
import { FlexSpacerDocItem } from '../FlexSpacer.doc';
import { IconButtonDocItem } from '../IconButton.doc';
import { IconContainerDocItem } from '../IconContainer.doc';
import { CountIndicatorDocItem } from '../CountIndicator.doc';
import { StatusIndicatorDocItem } from '../StatusIndicator.doc';
import { LabeledInputDocItem } from '../LabeledInput.doc';
import { LinkButtonDocItem } from '../LinkButton.doc';
import { MainMenuDocItem } from '../mainMenu/MainMenu.doc';
import { ModalsDocItem } from '../Modals.doc';
import { MultiSwitchDocItem } from '../MultiSwitch.doc';
import { NotificationCardDocItem } from '../NotificationCard.doc';
import { NumericInputDocItem } from '../NumericInput.doc';
import { PaginatorDocItem } from '../Paginator.doc';
import { PickerInputDocItem } from '../pickerInput/PickerInput.doc';
import { RadioGroupDocItem } from '../RadioGroup.doc';
import { RadioInputDocItem } from '../RadioInput.doc';
import { RangeDatePickerDocItem } from '../rangeDatePicker/RangeDatePicker.doc';
import { RatingDocItem } from '../Rating.doc';
import { SearchInputDocItem } from '../SearchInput.doc';
import { SliderDocItem } from '../Slider.doc';
import { SliderRatingDocItem } from '../SliderRating.doc';
import { SpinnerDocItem } from '../Spinner.doc';
import { SwitchDocItem } from '../Switch.doc';
import { TabButtonDocItem } from '../TabButton.doc';
import { TagDocItem } from '../Tag.doc';
import { TextDocItem } from '../Text.doc';
import { TextAreaDocItem } from '../TextArea.doc';
import { TextInputDocItem } from '../TextInput.doc';
import { TextPlaceholderDocItem } from '../TextPlaceholder.doc';
import { TimePickerDocItem } from '../TimePicker.doc';
import { TooltipDocItem } from '../Tooltip.doc';
import { FormDocItem } from '../Form.doc';
import { FileUploadDocItem } from '../FileUpload.doc';
import { VirtualListDocItem } from '../VirtualList.doc';
import { ProgressBarDocItem } from '../ProgressBar.doc';
import { ScrollSpyDocItem } from '../ScrollSpy.doc';
import { VerticalTabButtonDocItem } from '../VerticalTabButton.doc';
import { DropdownContainerDocItem } from '../dropdownContainer/DropdownContainer.doc';
import { PickerListDocItem } from '../PickerList.doc';
import { PickerModalDocItem } from '../PickerModal.doc';
import { RichTextEditorDocItem } from '../RichTextEditor.doc';
import { RichTextEditorSerializersDocItem } from '../RichTextEditorSerializers.doc';
import { RichTextViewDocItem } from '../richTextView/RichTextView.doc';
import { TreeDocItem } from '../Tree.doc';
import { TablesOverviewDocItem } from '../tables/Overview.doc';
import { EditableTablesDocItem } from '../tables/EditableTables.doc';
import { AdvancedTablesDocItem } from '../tables/Advanced.doc';
import { useTableStateDocItem } from '../tables/useTableState.doc';
import { FiltersPanelDocItem } from '../tables/FiltersPanel.doc';
import { PresetsPanelDocItem } from '../tables/PresetsPanel.doc';

export const componentsStructure: DocItem[] = orderBy(
    [
        { id: 'components', name: 'Components' },
        AccordionDocItem,
        AdaptivePanelDocItem,
        AlertDocItem,
        AnchorDocItem,
        AvatarDocItem,
        AvatarStackDocItem,
        BadgeDocItem,
        BlockerDocItem,
        ButtonDocItem,
        CheckboxDocItem,
        CheckboxGroupDocItem,
        ControlGroupDocItem,
        DatePickerDocItem,
        DropdownDocItem,
        DropdownMenuDocItem,
        { id: 'flexItems', name: 'Flex Items', parentId: 'components' },
        PanelDocItem,
        FlexRowDocItem,
        FlexCellDocItem,
        FlexSpacerDocItem,
        { id: 'richTextEditor', name: 'Rich Text Editor', parentId: 'components', tags: ['RTE', 'RichTextEditor'] },
        RichTextEditorDocItem,
        RichTextEditorSerializersDocItem,
        IconButtonDocItem,
        IconContainerDocItem,
        CountIndicatorDocItem,
        StatusIndicatorDocItem,
        LabeledInputDocItem,
        LinkButtonDocItem,
        MainMenuDocItem,
        ModalsDocItem,
        MultiSwitchDocItem,
        NotificationCardDocItem,
        NumericInputDocItem,
        PaginatorDocItem,
        PickerInputDocItem,
        PickerModalDocItem,
        PickerListDocItem,
        RadioGroupDocItem,
        RadioInputDocItem,
        RangeDatePickerDocItem,
        RatingDocItem,
        RichTextViewDocItem,
        SearchInputDocItem,
        SliderDocItem,
        SliderRatingDocItem,
        SpinnerDocItem,
        SwitchDocItem,
        TabButtonDocItem,
        { id: 'tables', name: 'Data Tables', parentId: 'components', tags: ['table'] },
        TablesOverviewDocItem,
        TreeDocItem,
        EditableTablesDocItem,
        AdvancedTablesDocItem,
        useTableStateDocItem,
        FiltersPanelDocItem,
        PresetsPanelDocItem,
        TagDocItem,
        TextDocItem,
        TextAreaDocItem,
        TextInputDocItem,
        TextPlaceholderDocItem,
        TimePickerDocItem,
        TooltipDocItem,
        FormDocItem,
        FileUploadDocItem,
        VerticalTabButtonDocItem,
        VirtualListDocItem,
        ProgressBarDocItem,
        ScrollSpyDocItem,
        DropdownContainerDocItem,
    ],
    (item: DocItem) => (item.order ? item.order + item.name : item.name),
);
