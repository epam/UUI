import { orderBy } from '@epam/uui-core';
import { DocItem } from '@epam/uui-docs';

import ButtonDocItem from '../../docs/pages/components/button.json';
import BadgeDocItem from '../../docs/pages/components/badge.json';
import AlertDocItem from '../../docs/pages/components/alert.json';
import CheckboxGroupDocItem from '../../docs/pages/components/checkboxGroup.json';
import ControlGroupDocItem from '../../docs/pages/components/controlGroup.json';
import DatePickerDocItem from '../../docs/pages/components/datePicker.json';
import DropdownDocItem from '../../docs/pages/components/dropdown.json';
import DropdownMenuDocItem from '../../docs/pages/components/dropdownMenu.json';
import AccordionDocItem from '../../docs/pages/components/accordion.json';
import AdaptivePanelDocItem from '../../docs/pages/components/adaptivePanel.json';
import AnchorDocItem from '../../docs/pages/components/anchor.json';
import AvatarDocItem from '../../docs/pages/components/avatar.json';
import AvatarStackDocItem from '../../docs/pages/components/avatarStack.json';
import BlockerDocItem from '../../docs/pages/components/blocker.json';
import CheckboxDocItem from '../../docs/pages/components/checkbox.json';
import PanelDocItem from '../../docs/pages/components/panel.json';
import FlexRowDocItem from '../../docs/pages/components/flexRow.json';
import FlexCellDocItem from '../../docs/pages/components/flexCell.json';
import FlexSpacerDocItem from '../../docs/pages/components/flexSpacer.json';
import IconButtonDocItem from '../../docs/pages/components/iconButton.json';
import IconContainerDocItem from '../../docs/pages/components/iconContainer.json';
import CountIndicatorDocItem from '../../docs/pages/components/countIndicator.json';
import StatusIndicatorDocItem from '../../docs/pages/components/statusIndicator.json';
import LabeledInputDocItem from '../../docs/pages/components/labeledInput.json';
import LinkButtonDocItem from '../../docs/pages/components/linkButton.json';
import MainMenuDocItem from '../../docs/pages/components/mainMenu.json';
import ModalsDocItem from '../../docs/pages/components/modals.json';
import MultiSwitchDocItem from '../../docs/pages/components/multiSwitch.json';
import NotificationCardDocItem from '../../docs/pages/components/notificationCard.json';
import NumericInputDocItem from '../../docs/pages/components/numericInput.json';
import PaginatorDocItem from '../../docs/pages/components/paginator.json';
import PickerInputDocItem from '../../docs/pages/components/pickerInput.json';
import RadioGroupDocItem from '../../docs/pages/components/radioGroup.json';
import RadioInputDocItem from '../../docs/pages/components/radioInput.json';
import RangeDatePickerDocItem from '../../docs/pages/components/rangeDatePicker.json';
import RatingDocItem from '../../docs/pages/components/rating.json';
import SearchInputDocItem from '../../docs/pages/components/searchInput.json';
import SliderDocItem from '../../docs/pages/components/slider.json';
import SliderRatingDocItem from '../../docs/pages/components/sliderRating.json';
import SpinnerDocItem from '../../docs/pages/components/spinner.json';
import SwitchDocItem from '../../docs/pages/components/switch.json';
import TabButtonDocItem from '../../docs/pages/components/tabButton.json';
import TagDocItem from '../../docs/pages/components/tag.json';
import TextDocItem from '../../docs/pages/components/text.json';
import TextAreaDocItem from '../../docs/pages/components/textArea.json';
import TextInputDocItem from '../../docs/pages/components/textInput.json';
import TextPlaceholderDocItem from '../../docs/pages/components/textPlaceholder.json';
import TimePickerDocItem from '../../docs/pages/components/timePicker.json';
import TooltipDocItem from '../../docs/pages/components/tooltip.json';
import FormDocItem from '../../docs/pages/components/form.json';
import FileUploadDocItem from '../../docs/pages/components/fileUpload.json';
import VirtualListDocItem from '../../docs/pages/components/virtualList.json';
import ProgressBarDocItem from '../../docs/pages/components/progressBar.json';
import ScrollSpyDocItem from '../../docs/pages/components/scrollSpy.json';
import VerticalTabButtonDocItem from '../../docs/pages/components/verticalTabButton.json';
import DropdownContainerDocItem from '../../docs/pages/components/dropdownContainer.json';
import PickerListDocItem from '../../docs/pages/components/pickerList.json';
import PickerModalDocItem from '../../docs/pages/components/pickerModal.json';
import RichTextEditorDocItem from '../../docs/pages/components/richTextEditor.json';
import RichTextEditorSerializersDocItem from '../../docs/pages/components/richTextEditorSerializers.json';
import RichTextViewDocItem from '../../docs/pages/components/richTextView.json';
import TreeDocItem from '../../docs/pages/components/tree.json';
import TablesOverviewDocItem from '../../docs/pages/tables/tablesOverview.json';
import EditableTablesDocItem from '../../docs/pages/tables/editableTables.json';
import AdvancedTablesDocItem from '../../docs/pages/tables/advancedTables.json';
import useTableStateDocItem from '../../docs/pages/tables/useTableState.json';
import FiltersPanelDocItem from '../../docs/pages/tables/filtersPanel.json';
import PresetsPanelDocItem from '../../docs/pages/tables/presetsPanel.json';

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
