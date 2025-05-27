import { orderBy } from '@epam/uui-core';
import { ButtonDocItem, BadgeDocItem, AlertDocItem } from '../docs';
import { DocItem } from './structure';
import { CheckboxGroupDocItem } from '../docs/CheckboxGroup.doc';
import { ControlGroupDocItem } from '../docs/ControlGroup.doc';
import { DatePickerDocItem } from '../docs/datePicker/DatePicker.doc';
import { DropdownDocItem } from '../docs/Dropdown.doc';
import { DropdownMenuDocItem } from '../docs/DropdownMenu.doc';
import { AccordionDocItem } from '../docs/accordion/Accordion.doc';
import { AdaptivePanelDocItem } from '../docs/AdaptivePanel.doc';
import { AnchorDocItem } from '../docs/anchor/Anchor.doc';
import { AvatarDocItem } from '../docs/Avatar.doc';
import { AvatarStackDocItem } from '../docs/avatarStack/AvatarStack.doc';
import { BlockerDocItem } from '../docs/Blocker.doc';
import { CheckboxDocItem } from '../docs/Checkbox.doc';
import { PanelDocItem } from '../docs/panel/Panel.doc';
import { FlexRowDocItem } from '../docs/flexRow/FlexRow.doc';
import { FlexCellDocItem } from '../docs/FlexCell.doc';
import { FlexSpacerDocItem } from '../docs/FlexSpacer.doc';
import { IconButtonDocItem } from '../docs/IconButton.doc';
import { IconContainerDocItem } from '../docs/IconContainer.doc';
import { CountIndicatorDocItem } from '../docs/CountIndicator.doc';
import { StatusIndicatorDocItem } from '../docs/StatusIndicator.doc';
import { LabeledInputDocItem } from '../docs/LabeledInput.doc';
import { LinkButtonDocItem } from '../docs/LinkButton.doc';
import { MainMenuDocItem } from '../docs/mainMenu/MainMenu.doc';
import { ModalsDocItem } from '../docs/Modals.doc';
import { MultiSwitchDocItem } from '../docs/MultiSwitch.doc';
import { NotificationCardDocItem } from '../docs/NotificationCard.doc';
import { NumericInputDocItem } from '../docs/NumericInput.doc';
import { PaginatorDocItem } from '../docs/Paginator.doc';
import { PickerInputDocItem } from '../docs/pickerInput/PickerInput.doc';
import { RadioGroupDocItem } from '../docs/RadioGroup.doc';
import { RadioInputDocItem } from '../docs/RadioInput.doc';
import { RangeDatePickerDocItem } from '../docs/rangeDatePicker/RangeDatePicker.doc';
import { RatingDocItem } from '../docs/Rating.doc';
import { SearchInputDocItem } from '../docs/SearchInput.doc';
import { SliderDocItem } from '../docs/Slider.doc';
import { SliderRatingDocItem } from '../docs/SliderRating.doc';
import { SpinnerDocItem } from '../docs/Spinner.doc';
import { SwitchDocItem } from '../docs/Switch.doc';
import { TabButtonDocItem } from '../docs/TabButton.doc';
import { TagDocItem } from '../docs/Tag.doc';
import { TextDocItem } from '../docs/Text.doc';
import { TextAreaDocItem } from '../docs/TextArea.doc';
import { TextInputDocItem } from '../docs/TextInput.doc';
import { TextPlaceholderDocItem } from '../docs/TextPlaceholder.doc';
import { TimePickerDocItem } from '../docs/TimePicker.doc';
import { TooltipDocItem } from '../docs/Tooltip.doc';
import { FormDocItem } from '../docs/Form.doc';
import { FileUploadDocItem } from '../docs/FileUpload.doc';
import { VerticalTabButtonDocItem } from '../docs/VerticalTabButton.doc';
import { VirtualListDocItem } from '../docs/VirtualList.doc';
import { ProgressBarDocItem } from '../docs/ProgressBar.doc';
import { ScrollSpyDocItem } from '../docs/ScrollSpy.doc';
import { DropdownContainerDocItem } from '../docs/dropdownContainer/DropdownContainer.doc';
import { PickerModalDocItem } from '../docs/PickerModal.doc';
import { PickerListDocItem } from '../docs/PickerList.doc';
import { RichTextViewDocItem } from '../docs/richTextView/RichTextView.doc';
import { TreeDocItem } from '../docs/Tree.doc';
import { TablesOverviewDocItem } from '../docs/tables/Overview.doc';
import { EditableTablesDocItem } from '../docs/tables/EditableTables.doc';
import { AdvancedTablesDocItem } from '../docs/tables/Advanced.doc';
import { useTableStateDocItem } from '../docs/tables/useTableState.doc';
import { FiltersPanelDocItem } from '../docs/tables/FiltersPanel.doc';
import { PresetsPanelDocItem } from '../docs/tables/PresetsPanel.doc';
import { RichTextEditorDocItem } from '../docs/RichTextEditor.doc';
import { RichTextEditorSerializersDocItem } from '../docs/RichTextEditorSerializers.doc';

export const componentsStructure: DocItem[] = orderBy(
    [
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
