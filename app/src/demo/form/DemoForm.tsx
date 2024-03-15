import * as React from 'react';
import {
    useArrayDataSource, useLazyDataSource, ILens, Lens, useAsyncDataSource, AsyncDataSource, UuiContexts, useUuiContext,
} from '@epam/uui-core';
import { demoData, Country } from '@epam/uui-docs';
import type { TApi } from '../../data';
import {
    FlexCell,
    FlexRow,
    FlexSpacer,
    LabeledInput,
    Panel,
    PickerInput,
    RichTextView,
    SuccessNotification,
    ErrorNotification,
    Text,
    TextInput,
    DatePicker,
    Tooltip,
    IconContainer,
    Switch,
    Button,
    IconButton,
    NumericInput,
    RangeDatePicker,
    MultiSwitch,
    DropSpot,
    FileCard,
    useForm,
} from '@epam/uui';
import type {
    PersonDetails, Attachment, PersonLanguageInfo, PersonTravelVisa,
} from './types';
import { personDetailsSchema } from './validationShema';
import { defaultData, emptyInfo } from './defaultData';
import { ReactComponent as InfoIcon } from '@epam/assets/icons/common/notification-help-outline-24.svg';
import { ReactComponent as AddIcon } from '@epam/assets/icons/common/action-add-18.svg';
import { ReactComponent as ClearIcon } from '@epam/assets/icons/common/navigation-close-24.svg';
import css from './DemoForm.module.scss';
import dayjs, { Dayjs } from 'dayjs';

const tShirtSizes = [
    { id: 1, caption: 'XS' }, { id: 2, caption: 'S' }, { id: 3, caption: 'M' }, { id: 4, caption: 'L' }, { id: 5, caption: 'XL' },
];

function removeLensItemHandler<T>(lens: ILens<T[]>, index: number) {
    return lens.set(lens.get().filter((_, i: number) => index !== i));
}

function addLensItemHandler<T>(lens: ILens<T[]>, item: T) {
    return lens.set(lens.get().concat(item));
}

function PersonalInfo({ lens }: { lens: ILens<PersonDetails['personalInfo']> }) {
    return (
        <>
            <RichTextView>
                <h2 className={ css.sectionTitle }>Personal Info</h2>
            </RichTextView>
            <FlexRow vPadding="12">
                <FlexCell minWidth={ 324 }>
                    <LabeledInput htmlFor="fullName" label="Full Name" { ...lens.prop('fullName').toProps() }>
                        <TextInput { ...lens.prop('fullName').toProps() } id="fullName" placeholder="Ivan Petrov" />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
            <FlexRow vPadding="12">
                <FlexCell width="auto">
                    <LabeledInput htmlFor="birthDate" label="Date of Birth" { ...lens.prop('birthdayDate').toProps() }>
                        <DatePicker
                            filter={ (day: Dayjs) => day.valueOf() <= dayjs().subtract(0, 'day').valueOf() }
                            id="birthDate"
                            format="MMM D, YYYY"
                            { ...lens.prop('birthdayDate').toProps() }
                        />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
        </>
    );
}

function Location({ lens, countriesDS }: { lens: ILens<PersonDetails['location']>; countriesDS: AsyncDataSource<Country, string, unknown> }) {
    const svc = useUuiContext<TApi, UuiContexts>();

    const citiesDataSource = useLazyDataSource(
        {
            api: svc.api.demo.cities,
        },
        [],
    );

    return (
        <>
            <RichTextView>
                <h3>Location</h3>
            </RichTextView>

            <FlexRow vPadding="12" alignItems="top" cx={ css.sectionRow }>
                <FlexCell minWidth={ 200 } grow={ 1 }>
                    <LabeledInput htmlFor="country" label="Country" { ...lens.prop('country').toProps() }>
                        <PickerInput
                            { ...lens.prop('country').toProps() }
                            dataSource={ countriesDS }
                            selectionMode="single"
                            valueType="id"
                            id="country"
                            placeholder="Select Country"
                            onValueChange={ (value) => lens.set({ country: value as string, city: null }) }
                        />
                    </LabeledInput>
                </FlexCell>
                <FlexCell minWidth={ 200 } grow={ 1 }>
                    <LabeledInput htmlFor="city" label="City" { ...lens.prop('city').toProps() }>
                        <PickerInput
                            { ...lens.prop('city').toProps() }
                            selectionMode="single"
                            valueType="id"
                            id="city"
                            dataSource={ citiesDataSource }
                            filter={ { country: lens.prop('country').get() } }
                            placeholder="Select City"
                        />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
        </>
    );
}

function PrimaryInfo({ lens }: { lens: ILens<PersonDetails['primaryInfo']> }) {
    return (
        <>
            <FlexRow>
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
                <FlexCell minWidth={ 324 }>
                    <FlexRow size="48" columnGap="18" alignItems="bottom">
                        <Switch label="Time Reporting" { ...lens.prop('timeReporting').toProps() } isDisabled />
                        <Switch label="Remote" { ...lens.prop('remoteStatus').toProps() } isDisabled />
                    </FlexRow>
                </FlexCell>
            </FlexRow>
        </>
    );
}

function Education({ lens }: { lens: ILens<PersonDetails['education']> }) {
    const institutionLevelsDataSource = useArrayDataSource(
        {
            items: demoData.universities,
        },
        [],
    );

    return (
        <>
            <RichTextView>
                <h3>Education</h3>
            </RichTextView>

            <FlexRow vPadding="12">
                <FlexCell minWidth={ 324 }>
                    <LabeledInput htmlFor="institution" label="Institution" { ...lens.prop('institution').toProps() }>
                        <PickerInput
                            { ...lens.prop('institution').toProps() }
                            dataSource={ institutionLevelsDataSource }
                            selectionMode="single"
                            id="institution"
                            getName={ (item) => item.university.split(' / ')[0] }
                            sorting={ { field: 'university', direction: 'asc' } }
                            valueType="id"
                            placeholder="Select Institution"
                        />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
            <FlexRow vPadding="12" alignItems="top" cx={ css.sectionRow }>
                <FlexCell minWidth={ 200 } grow={ 1 }>
                    <LabeledInput htmlFor="faculty" label="Faculty" { ...lens.prop('faculty').toProps() }>
                        <TextInput { ...lens.prop('faculty').toProps() } placeholder="Faculty Name" id="faculty" />
                    </LabeledInput>
                </FlexCell>
                <FlexCell minWidth={ 200 } grow={ 1 }>
                    <LabeledInput htmlFor="department" label="Department" { ...lens.prop('department').toProps() }>
                        <TextInput { ...lens.prop('department').toProps() } placeholder="Department Name" id="department" />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
            <FlexRow vPadding="12" alignItems="top" cx={ css.sectionRow }>
                <FlexCell minWidth={ 200 } grow={ 1 }>
                    <LabeledInput htmlFor="degree" label="Degree" { ...lens.prop('degree').toProps() }>
                        <TextInput { ...lens.prop('degree').toProps() } placeholder="Degree Name" id="degree" />
                    </LabeledInput>
                </FlexCell>
                <FlexCell minWidth={ 200 } grow={ 1 }>
                    <LabeledInput htmlFor="speciality" label="Speciality" { ...lens.prop('speciality').toProps() }>
                        <TextInput { ...lens.prop('speciality').toProps() } placeholder="Speciality Name" id="speciality" />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
            <FlexRow vPadding="12" columnGap="18">
                <FlexCell minWidth={ 120 }>
                    <LabeledInput htmlFor="graduationYear" label="Graduation year" { ...lens.prop('graduationYear').toProps() }>
                        <NumericInput
                            { ...lens.prop('graduationYear').toProps() }
                            min={ 0 }
                            max={ new Date().getFullYear() }
                            placeholder="2020"
                            id="graduationYear"
                            disableLocaleFormatting
                        />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
        </>
    );
}

function Languages({ lens }: { lens: ILens<PersonDetails['languageInfo']> }) {
    const svc = useUuiContext<TApi, UuiContexts>();

    const languageDataSource = useAsyncDataSource(
        {
            api: () => svc.api.demo.languages({}).then((r) => r.items),
        },
        [],
    );

    const languageLevelsDataSource = useArrayDataSource(
        {
            items: demoData.languageLevels,
        },
        [],
    );

    return (
        <>
            <RichTextView>
                <h3>Languages</h3>
            </RichTextView>
            {lens.get().map(({ language, speakingLevel, writingLevel }, index) => {
                const lensItem = lens.index(index);
                const isClearable = index !== 0 || language || speakingLevel || writingLevel;

                return (
                    <FlexRow key={ index } vPadding="12" columnGap="18" alignItems="top">
                        <FlexCell width={ 186 }>
                            <LabeledInput htmlFor={ `language-${index}` } label="Language" { ...lensItem.prop('language').toProps() }>
                                <PickerInput
                                    { ...lensItem.prop('language').toProps() }
                                    dataSource={ languageDataSource }
                                    selectionMode="single"
                                    valueType="id"
                                    id={ `language-${index}` }
                                    placeholder="Select Language"
                                />
                            </LabeledInput>
                        </FlexCell>
                        <FlexCell width={ 120 }>
                            <LabeledInput htmlFor={ `speakingLevel-${index}` } label="Speaking" { ...lensItem.prop('speakingLevel').toProps() }>
                                <PickerInput
                                    { ...lensItem.prop('speakingLevel').toProps() }
                                    dataSource={ languageLevelsDataSource }
                                    selectionMode="single"
                                    valueType="id"
                                    id={ `speakingLevel-${index}` }
                                    placeholder="Select Level"
                                    getName={ (item) => item.level }
                                />
                            </LabeledInput>
                        </FlexCell>
                        <FlexCell width={ 120 }>
                            <LabeledInput htmlFor={ `writingLevel-${index}` } label="Writing" { ...lensItem.prop('writingLevel').toProps() }>
                                <PickerInput
                                    { ...lensItem.prop('writingLevel').toProps() }
                                    dataSource={ languageLevelsDataSource }
                                    selectionMode="single"
                                    valueType="id"
                                    id={ `writingLevel-${index}` }
                                    placeholder="Select Level"
                                    getName={ (item) => item.level }
                                />
                            </LabeledInput>
                        </FlexCell>
                        <FlexRow size="48" alignItems="bottom" cx={ css.clearButtonWrapper }>
                            {isClearable && <IconButton icon={ ClearIcon } onClick={ () => removeLensItemHandler<PersonLanguageInfo>(lens, index) } />}
                        </FlexRow>
                    </FlexRow>
                );
            })}
            <FlexRow vPadding="12">
                <Button onClick={ () => addLensItemHandler<PersonLanguageInfo>(lens, emptyInfo.language) } caption="Add One More" icon={ AddIcon } fill="none" />
            </FlexRow>
        </>
    );
}

function Visas({ lens, countriesDS }: { lens: ILens<PersonDetails['travelVisas']>; countriesDS: AsyncDataSource<Country, string, unknown> }) {
    const svc = useUuiContext<TApi, UuiContexts>();
    const visasLens = lens.prop('visas').default([emptyInfo.visa]);
    const scansLens = Lens.onEditable(lens.prop('scans').toProps()).default([]);

    const uploadFile = (files: File[], fileLens: ILens<Attachment[]>) => {
        if (files.length + fileLens.get().length <= 20 && files.every((elem) => elem.size <= 5000000)) {
            let tempIdCounter = 0;
            const attachments = fileLens.default([]).get();

            const updateAttachment = (newFile: Attachment, id: number) => {
                fileLens.set(attachments.map((i) => (i.id === id ? newFile : i)));
            };

            const trackProgress = (progress: number, id: number) => {
                const file = attachments.find((i) => i.id === id);
                file.progress = progress;
                updateAttachment(file, file.id);
            };

            files.map((file) => {
                const tempId = --tempIdCounter;
                const fileToAttach = {
                    id: tempId,
                    name: file.name,
                    size: file.size,
                    progress: 0,
                };

                attachments.push(fileToAttach);
                svc.uuiApi.uploadFile('/upload/uploadFileMock', file, { onProgress: (progress) => trackProgress(progress, tempId) }).then((res) => {
                    updateAttachment({ ...res, progress: 100 }, tempId);
                });
            });

            fileLens.set(attachments);
        } else {
            svc.uuiNotifications
                .show(
                    (props) => (
                        <ErrorNotification { ...props }>
                            <Text size="36" fontSize="14">
                                File size shouldn't exceed 5 MB and cannot upload more than 20 files!
                            </Text>
                        </ErrorNotification>
                    ),
                    { duration: 2 },
                )
                .catch(() => null);
        }
    };

    return (
        <>
            <RichTextView>
                <h3>Travel Visas</h3>
            </RichTextView>

            {visasLens.get().map((value, index) => {
                const isClearable = index !== 0 || value.country || value.term;
                return (
                    <FlexRow key={ index } vPadding="12" columnGap="18" alignItems="top">
                        <FlexCell width={ 324 }>
                            <LabeledInput htmlFor={ `travelVisasCountry-${index}` } label="Country" { ...visasLens.index(index).prop('country').toProps() }>
                                <PickerInput
                                    { ...visasLens.index(index).prop('country').toProps() }
                                    dataSource={ countriesDS }
                                    selectionMode="single"
                                    valueType="id"
                                    id={ `travelVisasCountry-${index}` }
                                    placeholder="Select Country"
                                />
                            </LabeledInput>
                        </FlexCell>
                        <FlexCell width={ 294 }>
                            <LabeledInput htmlFor="term" label="Term" { ...visasLens.index(index).prop('term').toProps() }>
                                <RangeDatePicker id="term" format="MMM D, YYYY" { ...visasLens.index(index).prop('term').toProps() } />
                            </LabeledInput>
                        </FlexCell>
                        <FlexRow size="48" alignItems="bottom" cx={ css.clearButtonWrapper }>
                            {isClearable && <IconButton icon={ ClearIcon } onClick={ () => removeLensItemHandler<PersonTravelVisa>(visasLens, index) } />}
                        </FlexRow>
                    </FlexRow>
                );
            })}
            <FlexRow vPadding="12">
                <Button onClick={ () => addLensItemHandler<PersonTravelVisa>(visasLens, emptyInfo.visa) } caption="Add One More" icon={ AddIcon } fill="none" />
            </FlexRow>
            <FlexRow vPadding="12" columnGap="18">
                <FlexCell width="100%">
                    <LabeledInput label="Scans">
                        <DropSpot infoText="Up to 20 files. Limit for 1 file is 5 MB" onUploadFiles={ (files) => uploadFile(files, scansLens) } />
                        <div className={ scansLens.get().length && css.attachmentContainer }>
                            {scansLens.get().map((i, index) => (
                                <FileCard key={ index } file={ i } onClick={ () => removeLensItemHandler<Attachment>(scansLens, index) } />
                            ))}
                        </div>
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
        </>
    );
}

function OtherInfo({ lens }: { lens: ILens<PersonDetails['otherInfo']> }) {
    return (
        <>
            <RichTextView>
                <h3>Other Info</h3>
            </RichTextView>

            <FlexRow vPadding="12">
                <FlexCell width="auto">
                    <LabeledInput label="T-Shirt Size" { ...lens.prop('tShirtSize').toProps() }>
                        <MultiSwitch items={ tShirtSizes } { ...lens.prop('tShirtSize').toProps() } />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
        </>
    );
}

export function DemoForm() {
    const svc = useUuiContext<TApi, UuiContexts>();
    const value = defaultData;

    const { lens, save } = useForm<PersonDetails>({
        settingsKey: 'form-test',
        value: value,
        getMetadata: personDetailsSchema,
        onSave: (person) => Promise.resolve({ form: person }),
        onSuccess: () =>
            svc.uuiNotifications
                .show(
                    (props) => (
                        <SuccessNotification { ...props }>
                            <Text size="36" fontSize="14">
                                Data has been saved!
                            </Text>
                        </SuccessNotification>
                    ),
                    { duration: 2 },
                )
                .catch(() => null),
    });

    const countriesDS = useAsyncDataSource<Country, string, unknown>(
        {
            api: () => svc.api.demo.countries({ sorting: [{ field: 'name' }] }).then((r) => r.items),
        },
        [],
    );

    return (
        <div className={ css.root }>
            <FlexRow size="48">
                <RichTextView>
                    <h1>My Profile</h1>
                </RichTextView>
                <FlexSpacer />
            </FlexRow>
            <Panel background="surface-main" cx={ css.formPanel } shadow>
                <FlexCell width="100%">
                    <PersonalInfo lens={ lens.prop('personalInfo') } />
                    <Location lens={ lens.prop('location') } countriesDS={ countriesDS } />
                    <PrimaryInfo lens={ lens.prop('primaryInfo') } />
                    <Education lens={ lens.prop('education') } />
                    <Languages lens={ lens.prop('languageInfo').default([emptyInfo.language]) } />
                    <Visas lens={ lens.prop('travelVisas') } countriesDS={ countriesDS } />
                    <OtherInfo lens={ lens.prop('otherInfo') } />
                    <hr className={ css.divider } />
                    <FlexRow columnGap="12">
                        <FlexSpacer />
                        <Button caption="Save" color="primary" onClick={ save } />
                    </FlexRow>
                </FlexCell>
            </Panel>
        </div>
    );
}
