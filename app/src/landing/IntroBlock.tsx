import React, { useState } from 'react';
import { Anchor, FlexCell, FlexRow, IconContainer, Text, FilterPickerBody, Panel, TabButton, Badge, Tooltip, Button, LabeledInput, TextInput, NumericInput, Switch, DatePicker, TimePicker, SuccessAlert } from '@epam/uui';
import css from './IntroBlock.module.scss';
import { ReactComponent as BrushIcon } from '../icons/brush.svg';
import { ReactComponent as BracketsIcon } from '../icons/brackets.svg';
import { ReactComponent as BlurLightImage } from '../icons/intro-blur-light-theme.svg';
import { ReactComponent as BlurDarkImage } from '../icons/intro-blur-dark-theme.svg';
import { ReactComponent as infoIcon } from '@epam/assets/icons/common/notification-info-outline-18.svg';
import { getCurrentTheme } from '../helpers';
import cx from 'classnames';
import { DataQueryFilter, useLazyDataSource, useUuiContext } from '@epam/uui-core';
import { Location } from '@epam/uui-docs';

export function IntroBlock() {
    const theme = getCurrentTheme();
    const svc = useUuiContext();
    const getHeaderClassName = (baseClass: string) => !!theme && theme === 'loveship_dark' ? `${baseClass}LoveshipDark` : `${baseClass}${theme.charAt(0).toUpperCase() + theme.slice(1)}`;
    const BLUR = theme === 'loveship_dark' ? BlurDarkImage : BlurLightImage;

    const [value, onValueChange] = useState<string[]>(['c-AN', 'BV', '1546102']);
    const [tabValue, onTabValueChange] = useState('All');
    const [isBadgeOpen, setIsBadgeOpen] = useState(false);
    const [textValue, setTextValue] = useState('');
    const [numValue, setNumValue] = useState(0);
    const [switchValue, setSwitchValue] = useState(true);
    const [dateValue, setDateValue] = useState('');
    const [timeValue, setTimeValue] = useState(null);

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
                            EPAM UUI is a complete set of components, guidelines, blueprints, examples, to build your apps on top of Figma, React and TypeScript
                        </Text>
                        <FlexRow columnGap="12" cx={ css.infoBlockWrapper }>
                            <Anchor cx={ css.infoBlock } href="/">
                                <IconContainer icon={ BrushIcon } cx={ css.infoStartIcon } />
                                <FlexCell grow={ 1 }>
                                    <Text fontSize="18" lineHeight="24" fontWeight="600" cx={ css.infoBlockHeader }>Design</Text>
                                    <Text fontSize="12" cx={ css.infoBlockText }>Start with design guidelines</Text>
                                </FlexCell>
                            </Anchor>
                            <Anchor cx={ css.infoBlock } href="/">
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
                                <FlexRow borderBottom={ true }>
                                    <TabButton caption="All" count={ 24 } isLinkActive={ tabValue === 'All' } onClick={ () => onTabValueChange('All') } size="60" />
                                    <TabButton caption="Recommended" count={ 12 } isLinkActive={ tabValue === 'Recommended' } onClick={ () => onTabValueChange('Recommended') } withNotify={ true } size="60" />
                                    <TabButton caption="New" isLinkActive={ tabValue === 'New' } onClick={ () => onTabValueChange('New') } size="60" />
                                </FlexRow>
                                <FlexRow cx={ css.infoComponentsInnerBlock }>
                                    <Badge color="success" caption="Production" isDropdown={ true } fill="outline" size="30" indicator={ true } onClick={ () => setIsBadgeOpen(!isBadgeOpen) } isOpen={ isBadgeOpen } />
                                    <Tooltip content="Info tooltip" placement="top">
                                        <IconContainer icon={ infoIcon } cx={ css.infoIcon } />
                                    </Tooltip>
                                    <Button fill="outline" caption="Watch more" size="30" onClick={ () => {} } />
                                </FlexRow>
                            </Panel>
                            <Panel background="surface-main" shadow={ true } cx={ css.componentsMiddleWrapper }>
                                <FlexRow columnGap="12" cx={ css.middleRow }>
                                    <LabeledInput label="Task Name" size="30">
                                        <TextInput cx={ css.middleRowText } size="30" placeholder="Enter a text" value={ textValue } onValueChange={ setTextValue } />
                                    </LabeledInput>
                                    <LabeledInput label="Contributors" size="30">
                                        <NumericInput cx={ css.middleRowNum } size="30" value={ numValue } onValueChange={ setNumValue } />
                                    </LabeledInput>
                                </FlexRow>
                                <Switch label="Interview required" value={ switchValue } onValueChange={ setSwitchValue } />
                                <FlexRow cx={ css.bottomRow } columnGap="12">
                                    <LabeledInput label="Interview Date" size="30">
                                        <DatePicker inputCx={ css.bottomRowDate } size="30" value={ dateValue } onValueChange={ setDateValue } placeholder="Select Date" />
                                    </LabeledInput>
                                    <LabeledInput label="Interview Time" size="30">
                                        <TimePicker inputCx={ css.bottomRowTime } size="30" value={ timeValue } onValueChange={ setTimeValue } />
                                    </LabeledInput>
                                </FlexRow>
                            </Panel>
                            <SuccessAlert size="36" onClose={ () => alert('close action') } actions={ [{ name: 'SEE DETAILS', action: () => null }] }>
                                <Text size="30">Invitation sent!</Text>
                            </SuccessAlert>
                        </div>
                    </div>
                </FlexRow>
            </FlexRow>
        </div>
    );
}
