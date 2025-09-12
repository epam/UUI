import React, { useState } from 'react';
import {
    Anchor,
    FlexCell,
    FlexRow,
    IconContainer,
    Text,
    FilterPickerBody,
    Panel,
    Badge,
    Tooltip,
    Button,
    LabeledInput,
    TextInput,
    NumericInput,
    Switch,
    DatePicker,
    TimePicker,
    SuccessAlert,
    SuccessNotification,
    DropdownMenuBody,
    DropdownMenuButton,
    Dropdown,
    FlexSpacer,
    BadgeProps,
    IconButton,
    Tabs,
} from '@epam/uui';
import { DataQueryFilter, DropdownBodyProps, INotification, useLazyDataSource, useUuiContext } from '@epam/uui-core';
import cx from 'classnames';
import { getCurrentTheme } from '../helpers';
import { Location } from '@epam/uui-docs';
import { ReactComponent as BrushIcon } from '../icons/brush.svg';
import { ReactComponent as BracketsIcon } from '../icons/brackets.svg';
import { ReactComponent as BlurLightImage } from '../icons/intro-blur-light-theme.svg';
import { ReactComponent as BlurDarkImage } from '../icons/intro-blur-dark-theme.svg';
import { ReactComponent as infoIcon } from '@epam/assets/icons/common/notification-info-outline-18.svg';
import { ReactComponent as navigationDownIcon } from '@epam/assets/icons/navigation-chevron_down-outline.svg';
import css from './IntroBlock.module.scss';

const dropdownMenuItems = [
    { id: 1, caption: 'Production', color: 'success' }, { id: 2, caption: 'Contributor', color: 'info' },
];

export function IntroBlock() {
    const theme = getCurrentTheme();
    const svc = useUuiContext();
    const getHeaderClassName = (baseClass: string) => !!theme && theme === 'loveship_dark' ? `${baseClass}LoveshipDark` : `${baseClass}${theme.charAt(0).toUpperCase() + theme.slice(1)}`;
    const BLUR = theme === 'loveship_dark' ? BlurDarkImage : BlurLightImage;

    const [value, onValueChange] = useState<string[]>(['BV', '1546102']);
    const [tabValue, onTabValueChange] = useState('All');
    const [selectedItem, setSelectedItem] = useState(dropdownMenuItems[0]);
    const [textValue, setTextValue] = useState('');
    const [numValue, setNumValue] = useState(1);
    const [switchValue, setSwitchValue] = useState(true);
    const [dateValue, setDateValue] = useState('');
    const [timeValue, setTimeValue] = useState(null);

    const handleSuccess = (text: string) => {
        svc.uuiNotifications
            .show(
                (props: INotification) => (
                    <SuccessNotification { ...props }>
                        <Text fontSize="14">
                            { text }
                        </Text>
                    </SuccessNotification>
                ),
            )
            .catch(() => null);
    };

    const dataSource = useLazyDataSource<Location, string, DataQueryFilter<Location>>(
        {
            api: (request, ctx) => {
                const { search } = request;
                const filter = search ? {} : { parentId: ctx?.parentId };
                return svc.api.demo.locations({ ...request, search, filter });
            },
            getId: (i) => i.id,
            getParentId: (i) => i.parentId,
            getChildCount: (l) => l.childCount,
        },
        [],
    );

    const unfoldedIds = ['c-AN', 'BV', 'TF'];
    const renderDemoPickerBody = () => {
        return (
            <Panel background="surface-main" shadow={ true } cx={ css.pickerDemoWrapper }>
                <FilterPickerBody
                    isOpen={ true }
                    value={ value }
                    onValueChange={ onValueChange }
                    dataSource={ dataSource }
                    title="Locations"
                    selectionMode="multi"
                    field="test"
                    type="multiPicker"
                    isFoldedByDefault={ (item) => {
                        return !unfoldedIds.includes(item.id);
                    } }
                    maxBodyHeight={ 320 }
                    cascadeSelection="implicit"
                />
            </Panel>
        );
    };

    const renderComponentsDemo = () => {
        return (
            <>
                { renderDemoPickerBody() }
            </>
        );
    };

    const handleDropdown = (id: number) => {
        setSelectedItem(dropdownMenuItems.filter((item) => item.id === id)[0]);
    };

    const statusDot = (color: string) => <span className={ css.dot } style={ { backgroundColor: `var(--uui-${color}-50)` } } />;

    const renderDropdownBody = (props: DropdownBodyProps) => {
        return (
            <DropdownMenuBody { ...props }>
                {dropdownMenuItems.map((item) => (
                    <DropdownMenuButton
                        key={ item.id }
                        caption={ item.caption }
                        icon={ () => statusDot(item.color) }
                        onClick={ () => {
                            handleDropdown(item.id);
                            props.onClose();
                        } }
                        isSelected={ item.id === selectedItem.id }
                    />
                ))}
            </DropdownMenuBody>
        );
    };

    return (
        <div className={ css.root }>
            <FlexRow cx={ css.info }>
                <div>
                    <IconContainer icon={ BLUR } cx={ css.blur } />
                </div>
                <FlexRow cx={ css.infoStartWrapper }>
                    <div className={ css.infoStart }>
                        <Text rawProps={ { role: 'heading', 'aria-level': 1 } } cx={ cx(css.introHeader, css[getHeaderClassName('introHeader')]) }>
                            Accelerate
                        </Text>
                        <Text cx={ cx(css.introHeaderText, css[getHeaderClassName('introHeaderText')]) }>
                            web applications development
                        </Text>
                        <Text fontSize="18" lineHeight="24" fontWeight="400" color="secondary" cx={ css.introHeaderLowerText }>
                            EPAM UUI is a comprehensive suite of components, all-in-one solutions, facilities,
                            and guidelines to build your apps on top of Figma, React and TypeScript
                        </Text>
                        <FlexRow columnGap="24" cx={ css.infoBlockWrapper }>
                            <Anchor cx={ css.infoBlock } href="/documents?id=gettingStartedForDesigners&category=forDesigners&mode=doc">
                                <IconContainer icon={ BrushIcon } cx={ css.infoStartIcon } />
                                <FlexCell grow={ 1 }>
                                    <Text fontSize="18" lineHeight="24" fontWeight="600" cx={ css.infoBlockHeader }>Design</Text>
                                    <Text fontSize="12" cx={ css.infoBlockText }>Start with design guidelines</Text>
                                </FlexCell>
                            </Anchor>
                            <Anchor cx={ css.infoBlock } href="/documents?id=gettingStarted">
                                <IconContainer icon={ BracketsIcon } cx={ css.infoEndIcon } />
                                <FlexCell grow={ 1 }>
                                    <Text fontSize="18" lineHeight="24" fontWeight="600" cx={ css.infoBlockHeader }>Develop</Text>
                                    <Text fontSize="12" cx={ css.infoBlockText }>Find installation guides</Text>
                                </FlexCell>
                            </Anchor>
                        </FlexRow>
                    </div>
                    <div className={ css.infoEnd }>
                        { renderComponentsDemo() }
                        <div className={ css.componentsWrapper }>
                            <Panel background="surface-main" shadow={ true } cx={ css.infoComponentsWrapper }>
                                <Tabs
                                    value={ tabValue }
                                    onValueChange={ onTabValueChange }
                                    items={ [
                                        {
                                            id: 'All',
                                            caption: 'All',
                                            count: 24,
                                            size: '60',
                                        },
                                        {
                                            id: 'Recommended',
                                            caption: 'Recommended',
                                            count: 12,
                                            withNotify: true,
                                            size: '60',
                                        },
                                        {
                                            id: 'New',
                                            caption: 'New',
                                            size: '60',
                                        },
                                    ] }
                                />
                                <FlexRow cx={ css.infoComponentsInnerBlock }>
                                    <Dropdown
                                        renderBody={ renderDropdownBody }
                                        renderTarget={ (props) => (
                                            <Badge
                                                { ...props }
                                                dropdownIcon={ navigationDownIcon }
                                                color={ selectedItem.color as BadgeProps['color'] }
                                                fill="outline"
                                                caption={ selectedItem.caption }
                                                size="24"
                                                indicator={ true }
                                            />
                                        ) }
                                        placement="bottom-start"
                                    />
                                    <Tooltip content="Info tooltip" placement="top">
                                        <IconButton color="neutral" icon={ infoIcon } cx={ css.infoIcon } />
                                    </Tooltip>
                                    <FlexSpacer />
                                    <Button fill="outline" caption="Watch more" onClick={ () => handleSuccess('Go to the docs to see more ;)') } />
                                </FlexRow>
                            </Panel>
                            <Panel background="surface-main" shadow={ true } cx={ css.componentsMiddleWrapper }>
                                <FlexRow columnGap="12" cx={ css.middleRow }>
                                    <LabeledInput label="Task Name">
                                        <TextInput cx={ css.middleRowText } placeholder="Enter a text" value={ textValue } onValueChange={ setTextValue } />
                                    </LabeledInput>
                                    <LabeledInput label="Contributors">
                                        <NumericInput cx={ css.middleRowNum } value={ numValue } onValueChange={ setNumValue } />
                                    </LabeledInput>
                                </FlexRow>
                                <Switch label="Interview required" value={ switchValue } onValueChange={ setSwitchValue } />
                                <FlexRow cx={ css.bottomRow } columnGap="12">
                                    <LabeledInput label="Interview Date">
                                        <DatePicker inputCx={ css.bottomRowDate } value={ dateValue } onValueChange={ setDateValue } placeholder="Select Date" />
                                    </LabeledInput>
                                    <LabeledInput label="Interview Time">
                                        <TimePicker inputCx={ css.bottomRowTime } value={ timeValue } onValueChange={ setTimeValue } />
                                    </LabeledInput>
                                </FlexRow>
                            </Panel>
                            <SuccessAlert onClose={ () => {} } actions={ [{ name: 'SEE DETAILS', action: () => handleSuccess('Go to the docs to see more ;)') }] }>
                                <Text size="none">Invitation sent!</Text>
                            </SuccessAlert>
                        </div>
                    </div>
                </FlexRow>
            </FlexRow>
        </div>
    );
}
