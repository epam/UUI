import { orderBy } from '@epam/uui-core';
import { DocItem } from '@epam/uui-docs';

import ButtonDocItem from 'uui-doc-pages/components/button.json';
import BadgeDocItem from 'uui-doc-pages/components/badge.json';
import AlertDocItem from 'uui-doc-pages/components/alert.json';
import CheckboxGroupDocItem from 'uui-doc-pages/components/checkboxGroup.json';
import ControlGroupDocItem from 'uui-doc-pages/components/controlGroup.json';
import DatePickerDocItem from 'uui-doc-pages/components/datePicker.json';
import DropdownDocItem from 'uui-doc-pages/components/dropdown.json';
import DropdownMenuDocItem from 'uui-doc-pages/components/dropdownMenu.json';
import AccordionDocItem from 'uui-doc-pages/components/accordion.json';
import AdaptivePanelDocItem from 'uui-doc-pages/components/adaptivePanel.json';
import AnchorDocItem from 'uui-doc-pages/components/anchor.json';
import AvatarDocItem from 'uui-doc-pages/components/avatar.json';
import AvatarStackDocItem from 'uui-doc-pages/components/avatarStack.json';
import BlockerDocItem from 'uui-doc-pages/components/blocker.json';
import CheckboxDocItem from 'uui-doc-pages/components/checkbox.json';
import PanelDocItem from 'uui-doc-pages/components/panel.json';
import FlexRowDocItem from 'uui-doc-pages/components/flexRow.json';
import FlexCellDocItem from 'uui-doc-pages/components/flexCell.json';
import FlexSpacerDocItem from 'uui-doc-pages/components/flexSpacer.json';
import IconButtonDocItem from 'uui-doc-pages/components/iconButton.json';
import IconContainerDocItem from 'uui-doc-pages/components/iconContainer.json';
import CountIndicatorDocItem from 'uui-doc-pages/components/countIndicator.json';
import StatusIndicatorDocItem from 'uui-doc-pages/components/statusIndicator.json';
import LabeledInputDocItem from 'uui-doc-pages/components/labeledInput.json';
import LinkButtonDocItem from 'uui-doc-pages/components/linkButton.json';
import MainMenuDocItem from 'uui-doc-pages/components/mainMenu.json';
import ModalsDocItem from 'uui-doc-pages/components/modals.json';
import MultiSwitchDocItem from 'uui-doc-pages/components/multiSwitch.json';
import NotificationCardDocItem from 'uui-doc-pages/components/notificationCard.json';
import NumericInputDocItem from 'uui-doc-pages/components/numericInput.json';
import PaginatorDocItem from 'uui-doc-pages/components/paginator.json';
import PickerInputDocItem from 'uui-doc-pages/components/pickerInput.json';
import RadioGroupDocItem from 'uui-doc-pages/components/radioGroup.json';
import RadioInputDocItem from 'uui-doc-pages/components/radioInput.json';
import RangeDatePickerDocItem from 'uui-doc-pages/components/rangeDatePicker.json';
import RatingDocItem from 'uui-doc-pages/components/rating.json';
import SearchInputDocItem from 'uui-doc-pages/components/searchInput.json';
import SliderDocItem from 'uui-doc-pages/components/slider.json';
import SliderRatingDocItem from 'uui-doc-pages/components/sliderRating.json';
import SpinnerDocItem from 'uui-doc-pages/components/spinner.json';
import SwitchDocItem from 'uui-doc-pages/components/switch.json';
import TabButtonDocItem from 'uui-doc-pages/components/tabButton.json';
import TagDocItem from 'uui-doc-pages/components/tag.json';
import TextDocItem from 'uui-doc-pages/components/text.json';
import TextAreaDocItem from 'uui-doc-pages/components/textArea.json';
import TextInputDocItem from 'uui-doc-pages/components/textInput.json';
import TextPlaceholderDocItem from 'uui-doc-pages/components/textPlaceholder.json';
import TimePickerDocItem from 'uui-doc-pages/components/timePicker.json';
import TooltipDocItem from 'uui-doc-pages/components/tooltip.json';
import FormDocItem from 'uui-doc-pages/components/form.json';
import FileUploadDocItem from 'uui-doc-pages/components/fileUpload.json';
import VirtualListDocItem from 'uui-doc-pages/components/virtualList.json';
import ProgressBarDocItem from 'uui-doc-pages/components/progressBar.json';
import ScrollSpyDocItem from 'uui-doc-pages/components/scrollSpy.json';
import VerticalTabButtonDocItem from 'uui-doc-pages/components/verticalTabButton.json';
import DropdownContainerDocItem from 'uui-doc-pages/components/dropdownContainer.json';
import PickerListDocItem from 'uui-doc-pages/components/pickerList.json';
import PickerModalDocItem from 'uui-doc-pages/components/pickerModal.json';
import RichTextEditorDocItem from 'uui-doc-pages/components/richTextEditor.json';
import RichTextEditorSerializersDocItem from 'uui-doc-pages/components/richTextEditorSerializers.json';
import RichTextViewDocItem from 'uui-doc-pages/components/richTextView.json';
import TreeDocItem from 'uui-doc-pages/components/tree.json';
import TablesOverviewDocItem from 'uui-doc-pages/tables/tablesOverview.json';
import EditableTablesDocItem from 'uui-doc-pages/tables/editableTables.json';
import AdvancedTablesDocItem from 'uui-doc-pages/tables/advancedTables.json';
import useTableStateDocItem from 'uui-doc-pages/tables/useTableState.json';
import FiltersPanelDocItem from 'uui-doc-pages/tables/filtersPanel.json';
import PresetsPanelDocItem from 'uui-doc-pages/tables/presetsPanel.json';

export const componentsStructure: DocItem[] = orderBy<DocItem>(
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
