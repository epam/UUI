import * as React from 'react';
import { ILens } from '@epam/uui-core';
import {
    FlexCell, FlexRow, IconContainer, LabeledInput, RichTextView, Switch, TextInput, Tooltip,
} from '@epam/uui';
import { ReactComponent as InfoIcon } from '@epam/assets/icons/common/notification-help-outline-24.svg';
import { PersonPrimaryInfo } from '../types';
import css from '../DemoForm.module.scss';

export function PrimaryInfoSection({ lens }: { lens: ILens<PersonPrimaryInfo> }) {
    return (
        <>
            <FlexRow columnGap="6">
                <RichTextView>
                    <h3>Primary Info</h3>
                </RichTextView>
                <Tooltip offset={ [0, 3] } content="You have no permission to edit this information">
                    <IconContainer icon={ InfoIcon } cx={ css.infoIcon } />
                </Tooltip>
            </FlexRow>

            <FlexRow vPadding="12" alignItems="top" cx={ css.sectionRow }>
                <FlexCell minWidth={ 200 } grow={ 1 }>
                    <LabeledInput htmlFor="status" label="Status" { ...lens.prop('status').toProps() }>
                        <TextInput { ...lens.prop('status').toProps() } placeholder="Select Status" id="status" />
                    </LabeledInput>
                </FlexCell>
                <FlexCell minWidth={ 200 } grow={ 1 }>
                    <LabeledInput htmlFor="productionCategory" label="Production Category" { ...lens.prop('productionCategory').toProps() }>
                        <TextInput { ...lens.prop('productionCategory').toProps() } placeholder="Select Category" id="productionCategory" />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
            <FlexRow vPadding="12" alignItems="top" cx={ css.sectionRow }>
                <FlexCell minWidth={ 324 } grow={ 1 }>
                    <LabeledInput htmlFor="organizationalCategory" label="Organizational category" { ...lens.prop('organizationalCategory').toProps() }>
                        <TextInput { ...lens.prop('organizationalCategory').toProps() } placeholder="Select Organizational Category" id="organizationalCategory" />
                    </LabeledInput>
                </FlexCell>
                <FlexCell minWidth={ 186 } grow={ 1 }>
                    <LabeledInput htmlFor="jobFunction" label="Job Function" { ...lens.prop('jobFunction').toProps() }>
                        <TextInput { ...lens.prop('jobFunction').toProps() } placeholder="Select Job Function" id="jobFunction" />
                    </LabeledInput>
                </FlexCell>
                <FlexCell minWidth={ 120 } grow={ 1 }>
                    <LabeledInput htmlFor="jobFunctionLevel" label="Job Function Level" { ...lens.prop('jobFunctionLevel').toProps() }>
                        <TextInput { ...lens.prop('jobFunctionLevel').toProps() } placeholder="Select Level" id="jobFunctionLevel" />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
            <FlexRow vPadding="12" alignItems="top" cx={ css.sectionRow }>
                <FlexCell minWidth={ 324 } grow={ 1 }>
                    <FlexRow columnGap="18">
                        <FlexCell minWidth={ 120 } grow={ 1 }>
                            <LabeledInput htmlFor="currentProject" label="Current Project" { ...lens.prop('currentProject').toProps() }>
                                <TextInput { ...lens.prop('currentProject').toProps() } placeholder="Select Project" id="currentProject" />
                            </LabeledInput>
                        </FlexCell>
                        <FlexCell minWidth={ 186 } grow={ 1 }>
                            <LabeledInput htmlFor="projectRole" label="Role" { ...lens.prop('projectRole').toProps() }>
                                <TextInput { ...lens.prop('projectRole').toProps() } placeholder="Select Role" id="projectRole" />
                            </LabeledInput>
                        </FlexCell>
                    </FlexRow>
                </FlexCell>
                <FlexCell minWidth={ 324 } alignSelf="flex-end">
                    <FlexRow size="36" columnGap="18" alignItems="center">
                        <Switch label="Time Reporting" { ...lens.prop('timeReporting').toProps() } isDisabled />
                        <Switch label="Remote" { ...lens.prop('remoteStatus').toProps() } isDisabled />
                    </FlexRow>
                </FlexCell>
            </FlexRow>
        </>
    );
}
