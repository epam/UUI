import { ButtonExplorerConfig } from './ButtonConfig';
import { AlertConfig } from './AlertConfig';
import { CheckboxConfig } from './CheckboxConfig';
import { CountIndicatorConfig } from './CountIndicatorConfig';
import { AvatarConfig } from './AvatarConfig';
import { CheckboxGroupConfig } from './CheckboxGroupConfig';
import { MultiSwitchConfig } from './MultiSwitchConfig';
import { PickerInputConfig } from './pickerInput/PickerInputConfig';
import { SliderConfig } from './SliderConfig';
import { SliderRatingConfig } from './SliderRatingConfig';
import { SwitchConfig } from './SwitchConfig';
import { AccordionConfig } from './accordion/AccordionConfig';
import { AnchorConfig } from './anchor/AnchorConfig';
import { AvatarStackConfig } from './avatarStack/AvatarStackConfig';
import { DatePickerConfig } from './datePicker/DatePickerConfig';
import { DropdownContainerConfig } from './dropdownContainer/DropdownContainerConfig';
import { FlexRowConfig } from './flexRow/FlexRowConfig';
import { MainMenuConfig } from './mainMenu/MainMenuConfig';
import { PanelConfig } from './panel/PanelConfig';
import { RangeDatePickerConfig } from './rangeDatePicker/RangeDatePickerConfig';
import { RichTextViewConfig } from './richTextView/RichTextViewConfig';
import { BadgeConfig } from './BadgeConfig';
import { BlockerConfig } from './BlockerConfig';
import { ControlGroupConfig } from './ControlGroupConfig';
import { DropdownConfig } from './DropdownConfig';
import { FlexCellConfig } from './FlexCellConfig';
import { IconButtonConfig } from './IconButtonConfig';
import { IconContainerConfig } from './IconContainerConfig';
import { LinkButtonConfig } from './LinkButtonConfig';
import { TextConfig } from './TextConfig';
import { TextInputConfig } from './TextInputConfig';
import { TagConfig } from './TagConfig';
import { SpinnerConfig } from './SpinnerConfig';
import { RatingConfig } from './RatingConfig';
import { RadioInputConfig } from './RadioInputConfig';
import { StatusIndicatorConfig } from './StatusIndicatorConfig';
import { TextAreaConfig } from './TextAreaConfig';
import { SearchInputConfig } from './SearchInputConfig';
import { TimePickerConfig } from './TimePickerConfig';
import { TooltipConfig } from './TooltipConfig';
import { PaginatorConfig } from './PaginatorConfig';
import { NumericInputConfig } from './NumericInputConfig';
import { TextPlaceholderConfig } from './TextPlaceholderConfig';
import { NotificationCardConfig } from './NotificationCardConfig';
import { RadioGroupConfig } from './RadioGroupConfig';
import { LabeledInputExplorerConfig } from './LabeledInputConfig';
import { TabButtonExplorerConfig } from './TabButtonConfig';
import { VerticalTabButtonExplorerConfig } from './VerticalTabButtonConfig';
import { PickerListExplorerConfig } from './PickerListConfig';
// import { TreeConfig } from './TreeConfig';
import { TDocConfig } from '@epam/uui-docs';

export const explorerConfigs = [
    SwitchConfig,
    PickerInputConfig,
    CheckboxConfig,
    ButtonExplorerConfig,
    SwitchConfig,
    SliderRatingConfig,
    SliderConfig,
    MultiSwitchConfig,
    CheckboxGroupConfig,
    AvatarConfig,
    CountIndicatorConfig,
    AlertConfig,
    AccordionConfig,
    AnchorConfig,
    AvatarStackConfig,
    DatePickerConfig,
    DropdownContainerConfig,
    FlexRowConfig,
    MainMenuConfig,
    PanelConfig,
    RangeDatePickerConfig,
    RichTextViewConfig,
    BadgeConfig,
    BlockerConfig,
    ControlGroupConfig,
    DropdownConfig,
    FlexCellConfig,
    IconButtonConfig,
    IconContainerConfig,
    LinkButtonConfig,
    TextConfig,
    TextInputConfig,
    TagConfig,
    SpinnerConfig,
    RatingConfig,
    RadioInputConfig,
    StatusIndicatorConfig,
    TextAreaConfig,
    SearchInputConfig,
    TimePickerConfig,
    TooltipConfig,
    PaginatorConfig,
    NumericInputConfig,
    TextPlaceholderConfig,
    NotificationCardConfig,
    RadioGroupConfig,
    LabeledInputExplorerConfig,
    TabButtonExplorerConfig,
    VerticalTabButtonExplorerConfig,
    PickerListExplorerConfig,
    // TreeConfig, TODO: uncomment when structure would be improved
];

export const explorerConfigsMap = explorerConfigs.reduce<Map<string, TDocConfig >>((acc, config) => {
    acc.set(config.id, config);
    return acc;
}, new Map());
