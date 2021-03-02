import {
    ButtonDoc, LinkButtonDoc, PickerInputDoc, IconButtonDoc, TabButtonDoc, TextInputDoc, CheckboxDoc, RadioInputDoc, SwitchDoc, CheckboxGroupDoc,
    RadioGroupDoc, MultiSwitchDoc, NumericInputDoc, RatingDoc, SearchInputDoc, TextAreaDoc, AccordionDoc, ContextProviderDoc, ApiContextDoc, ModalContextDoc,
    NotificationContextDoc, DropdownDoc, MainMenuDoc, ModalsDoc, BadgeDoc, TablesDoc, TagDoc, PaginatorDoc, SpinnerDoc, RichTextViewDoc, TextDoc,
    TextPlaceholderDoc, DatePickerDoc, RangeDatePickerDoc, TimePickerDoc, ControlGroupDoc, GettingStartedDoc, NotificationCardDoc, TooltipDoc,
    LabeledInputDoc, AlertDoc, IconContainerDoc, BlockerDoc, IconsDoc, ColorsPageDoc, DownloadsDoc, ProjectsDoc, ReleaseNotesDoc, FlexItemsDoc,
    GettingStartedForDesignersDoc, ChangeManagementProcessDoc, RichTextEditorDoc, FormDoc, LockContextDoc, InternationalizationDoc,
    FileUploadDoc, SliderDoc, SliderRatingDoc, AvatarDoc, AvatarStackDoc, PickerListDoc, TeamDoc, AnalyticsContextDoc,
} from "../docs";
import sortBy from 'lodash.sortby';
import { OverviewDoc } from '../docs/Overview';
import { CoreConceptsDoc } from '../docs/CoreConcepts';

export interface DocItem {
    id: string;
    name: string;
    component?: any;
    parentId?: string;
}

const componentsStructure = sortBy([
    { id: 'accordion', name: 'Accordion', component: AccordionDoc, parentId: 'components' },
    { id: 'alert', name: 'Alert', component: AlertDoc, parentId: 'components' },
    { id: 'avatar', name: 'Avatar', component: AvatarDoc, parentId: 'components' },
    { id: 'avatarStack', name: 'AvatarStack', component: AvatarStackDoc, parentId: 'components' },
    { id: 'badge', name: 'Badge', component: BadgeDoc, parentId: 'components' },
    { id: 'blocker', name: 'Blocker', component: BlockerDoc, parentId: 'components' },
    { id: 'button', name: 'Button', component: ButtonDoc, parentId: 'components' },
    { id: 'checkbox', name: 'Checkbox', component: CheckboxDoc, parentId: 'components' },
    { id: 'checkboxGroup', name: 'Checkbox Group', component: CheckboxGroupDoc, parentId: 'components' },
    { id: 'controlGroup', name: 'Control Group', component: ControlGroupDoc, parentId: 'components' },
    { id: 'datePicker', name: 'Date Picker', component: DatePickerDoc, parentId: 'components' },
    { id: 'dropdown', name: 'Dropdown', component: DropdownDoc, parentId: 'components' },
    { id: 'flexItems', name: 'Flex Items', component: FlexItemsDoc, parentId: 'components' },
    { id: 'iconButton', name: 'Icon Button', component: IconButtonDoc, parentId: 'components' },
    { id: 'iconContainer', name: 'Icon Container', component: IconContainerDoc, parentId: 'components' },
    { id: 'labeledInput', name: 'Labeled Input', component: LabeledInputDoc, parentId: 'components' },
    { id: 'linkButton', name: 'Link button', component: LinkButtonDoc, parentId: 'components' },
    { id: 'mainMenu', name: 'Main Menu', component: MainMenuDoc, parentId: 'components' },
    { id: 'modals', name: 'Modals', component: ModalsDoc, parentId: 'components' },
    { id: 'multiSwitch', name: 'MultiSwitch', component: MultiSwitchDoc, parentId: 'components' },
    { id: 'notificationCard', name: 'Notification Card', component: NotificationCardDoc, parentId: 'components' },
    { id: 'numericInput', name: 'Numeric Input', component: NumericInputDoc, parentId: 'components' },
    { id: 'paginator', name: 'Paginator', component: PaginatorDoc, parentId: 'components' },
    { id: 'pickerInput', name: 'Picker Input', component: PickerInputDoc, parentId: 'components' },
    { id: 'PickerList', name: 'Picker List', component: PickerListDoc, parentId: 'components' },
    { id: 'radioGroup', name: 'Radio Group', component: RadioGroupDoc, parentId: 'components' },
    { id: 'radioInput', name: 'Radio Input', component: RadioInputDoc, parentId: 'components' },
    { id: 'rangeDatePicker', name: 'Range Date Picker', component: RangeDatePickerDoc, parentId: 'components' },
    { id: 'rating', name: 'Rating', component: RatingDoc, parentId: 'components' },
    { id: 'richTextView', name: 'RichTextView', component: RichTextViewDoc, parentId: 'components' },
    { id: 'searchInput', name: 'Search Input', component: SearchInputDoc, parentId: 'components' },
    { id: 'slider', name: 'Slider', component: SliderDoc, parentId: 'components' },
    { id: 'sliderRating', name: 'SliderRating', component: SliderRatingDoc, parentId: 'components' },
    { id: 'spinner', name: 'Spinner', component: SpinnerDoc, parentId: 'components' },
    { id: 'switch', name: 'Switch', component: SwitchDoc, parentId: 'components' },
    { id: 'tabButton', name: 'Tab Button', component: TabButtonDoc, parentId: 'components' },
    { id: 'tables', name: 'Tables', component: TablesDoc, parentId: 'components' },
    { id: 'tag', name: 'Tag', component: TagDoc, parentId: 'components' },
    { id: 'text', name: 'Text', component: TextDoc, parentId: 'components' },
    { id: 'textArea', name: 'TextArea', component: TextAreaDoc, parentId: 'components' },
    { id: 'textInput', name: 'Text Input', component: TextInputDoc, parentId: 'components' },
    { id: 'textPlaceholder', name: 'Text Placeholder', component: TextPlaceholderDoc, parentId: 'components' },
    { id: 'timePicker', name: 'TimePicker', component: TimePickerDoc, parentId: 'components' },
    { id: 'tooltip', name: 'Tooltip', component: TooltipDoc, parentId: 'components' },
    { id: 'richTextEditor', name: 'Rich Text Editor', component: RichTextEditorDoc, parentId: 'components' },
    { id: 'form', name: 'Form', component: FormDoc, parentId: 'components' },
    { id: 'fileUpload', name: 'File Upload', component: FileUploadDoc, parentId: 'components' },

], ['name']);

export const items: DocItem[] = [
    { id: 'overview', name: 'Overview', component: OverviewDoc },
    { id: 'coreConcepts', name: 'Core Concepts', component: CoreConceptsDoc },
    { id: 'gettingStarted', name: 'Getting Started', component: GettingStartedDoc },
    { id: 'forDesigners', name: 'For Designers' },
    { id: 'gettingStartedForDesigners', name: 'Getting Started', component: GettingStartedForDesignersDoc, parentId: 'forDesigners' },
    { id: 'changeManagementProcessDoc', name: 'Change Management Process', component: ChangeManagementProcessDoc, parentId: 'forDesigners' },
    { id: 'components', name: 'Components' },
    ...componentsStructure,
    { id: 'advanced', name: 'Advanced' },
    { id: 'localization', name: 'Internationalization', component: InternationalizationDoc, parentId: 'advanced' },
    { id: 'contexts', name: 'Contexts' },
    { id: 'contextProvider', name: 'Context Provider', component: ContextProviderDoc, parentId: 'contexts' },
    { id: 'apiContext', name: 'Api Context and Error Handling', component: ApiContextDoc, parentId: 'contexts' },
    { id: 'analyticsContext', name: 'Analytics Context', component: AnalyticsContextDoc, parentId: 'contexts' },
    { id: 'modalContext', name: 'Modal Context', component: ModalContextDoc, parentId: 'contexts' },
    { id: 'notificationContextDoc', name: 'Notification Context', component: NotificationContextDoc, parentId: 'contexts' },
    { id: 'lockContextDoc', name: 'Lock Context', component: LockContextDoc, parentId: 'contexts' },
    { id: 'assets', name: 'Assets' },
    { id: 'icons', name: 'Icons', component: IconsDoc, parentId: 'assets' },
    { id: 'promoColors', name: 'Colors', component: ColorsPageDoc, parentId: 'assets' },
    { id: 'downloads', name: 'Downloads', component: DownloadsDoc, parentId: 'assets' },
    { id: 'projects', name: 'Projects', component: ProjectsDoc },
    { id: 'team', name: 'Team', component: TeamDoc },
    { id: 'releaseNotes', name: 'Release Notes', component: ReleaseNotesDoc },
];
