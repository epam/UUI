import * as React from 'react';
import { ArrayDataSource, AsyncDataSource, FileUploadResponse, ILens, LazyDataSource, Lens, Metadata, RenderFormProps } from '@epam/uui';
import { demoData } from '@epam/uui-docs';
import { FlexCell, FlexRow, FlexSpacer, Form, LabeledInput, Panel, PickerInput, RichTextView, SuccessNotification, Text,
    TextInput, DatePicker, RadioGroup, Tooltip, IconContainer, Switch, Button, IconButton, NumericInput, TextArea, RangeDatePicker,
    MultiSwitch, DropSpot, FileCard } from '@epam/promo';
import { PersonDetails, PersonLanguageInfo, PersonTravelVisa } from './types';
import { svc } from '../../services';
import { personDetailsSchema } from './validationShema';
import { defaultData } from './defaultData';
import * as infoIcon from '@epam/assets/icons/common/notification-help-outline-24.svg';
import * as phoneIcon from '@epam/assets/icons/common/communication-phone-18.svg';
import * as mailIcon from '@epam/assets/icons/common/communication-mail-18.svg';
import * as addIcon from '@epam/assets/icons/common/action-add-18.svg';
import * as clearIcon from '@epam/assets/icons/common/navigation-close-24.svg';
import * as css from './DemoForm.scss';

interface DemoFormState {
    person: PersonDetails;
}

const tShirtSizes = [
    { id: 1, caption: 'XS' },
    { id: 2, caption: 'S' },
    { id: 3, caption: 'M' },
    { id: 4, caption: 'L' },
    { id: 5, caption: 'XL' },
];

export class DemoForm extends React.Component<{}, DemoFormState> {
    state: DemoFormState = {
        person: defaultData,
    };

    countriesDataSource = new AsyncDataSource({
        api: () => svc.api.demo.countries({ sorting: [{ field: 'name' }] }).then(r => r.items),
    });

    citiesDataSource = new LazyDataSource({
        api: (req) => svc.api.demo.cities(req),
    });

    languageDataSource = new AsyncDataSource({
        api: () => svc.api.demo.languages({}).then(r => r.items),
    });

    languageLevelsDataSource = new ArrayDataSource({
        items: demoData.languageLevels,
    });

    institutionLevelsDataSource = new ArrayDataSource({
        items: demoData.universities,
    });

    getMetaData = (value: PersonDetails): Metadata<PersonDetails> => {
        return personDetailsSchema(value);
    }

    uploadFile = (files: File[], lens: ILens<({progress?: number} & Partial<FileUploadResponse>)[]>) => {
        let tempIdCounter = 0;
        const attachments = lens.default([]).get();

        const updateAttachment = (newFile: any, id: number) => {
            lens.set(attachments.map(i => i.id === id ? newFile : i));
        };

        const trackProgress = (progress: number, id: number) => {
            const file = attachments.find(i => i.id === id);
            file.progress = progress;
            updateAttachment(file, file.id);
        };

        files.map(file => {
            const tempId = --tempIdCounter;
            const fileToAttach = {
                id: tempId,
                name: file.name,
                size: file.size,
                progress: 0,
            };

            attachments.push(fileToAttach);
            svc.uuiApi.uploadFile('/uploadFileMock', file, { onProgress: (progress) => trackProgress(progress, tempId) }).then(res => {
                updateAttachment({ ...res, progress: 100 }, tempId);
            });
        });

        lens.set(attachments);
    }

    removeLensItemHandler = (lens: ILens<any>, index: number) => {
        return lens.set([...lens.get().filter((item: any, i: number) => index !== i)]);
    }

    addLensItemHandler = (lens: ILens<any>, item: any) => {
        return lens.set([...lens.get(), item]);
    }

    renderPersonalInfoSection = (lens: ILens<PersonDetails>) => {
        const personalInfoLens = lens.prop('personalInfo');
        return (
            <>
                <RichTextView><h3 className={ css.sectionTitle }>Personal Info</h3></RichTextView>

                <FlexRow vPadding='12'>
                    <FlexCell minWidth={ 324 }>
                        <LabeledInput label='Full Name'  { ...personalInfoLens.prop('fullName').toProps() }>
                            <TextInput { ...personalInfoLens.prop('fullName').toProps() } placeholder='Ivan Petrov' />
                        </LabeledInput>
                    </FlexCell>
                </FlexRow>
                <FlexRow vPadding='12'>
                    <FlexCell width='auto'>
                        <LabeledInput label='Date of Birth' { ...personalInfoLens.prop('birthdayDate').toProps() }>
                            <DatePicker format='DD/MM/YYYY' { ...personalInfoLens.prop('birthdayDate').toProps() } />
                        </LabeledInput>
                    </FlexCell>
                </FlexRow>
                <FlexRow vPadding='12'>
                    <FlexCell minWidth={ 500 }>
                        <LabeledInput label='Sex' { ...personalInfoLens.prop('sex').toProps() }>
                            <RadioGroup
                                items={ [{ id: 'male', name: 'Male' }, { id: 'female', name: 'Female' }] }
                                { ...personalInfoLens.prop('sex').toProps() }
                                direction='horizontal'
                            />
                        </LabeledInput>
                    </FlexCell>
                </FlexRow>
            </>
        );
    }

    renderLocationSection = (lens: ILens<PersonDetails>) => {
        const locationLens = lens.prop('location');
        return (
            <>
                <RichTextView><h3>Location</h3></RichTextView>

                <FlexRow vPadding='12' spacing='18' alignItems='top'>
                    <LabeledInput label='Country' { ...locationLens.prop('country').toProps() }>
                        <PickerInput
                            { ...locationLens.prop('country').toProps() }
                            dataSource={ this.countriesDataSource }
                            selectionMode='single'
                            valueType='id'
                            placeholder='Select Country'
                            onValueChange={ (value) => {
                                locationLens.set({ country: value, city: null });
                            } }
                        />
                    </LabeledInput>
                    <LabeledInput label='City' { ...locationLens.prop('city').toProps() }>
                        <PickerInput
                            { ...locationLens.prop('city').toProps() }
                            selectionMode='single'
                            valueType='id'
                            dataSource={ this.citiesDataSource }
                            filter={ { country: locationLens.prop('country').get() } }
                            placeholder='Select City'
                        />
                    </LabeledInput>
                </FlexRow>
            </>
        );
    }

    renderContactsSection = (lens: ILens<PersonDetails>) => {
        const contactsLens = lens.prop('contacts');
        return (
            <>
                <RichTextView><h3>Contacts</h3></RichTextView>

                <FlexRow vPadding='12'>
                    <FlexCell minWidth={ 324 }>
                        <LabeledInput label='Phone number' { ...contactsLens.prop('phoneNumber').toProps() }>
                            <TextInput
                                { ...contactsLens.prop('phoneNumber').toProps() }
                                icon={ phoneIcon }
                                placeholder='+000(00)000-00-00'
                            />
                        </LabeledInput>
                    </FlexCell>
                </FlexRow>
                <FlexRow vPadding='12'>
                    <FlexCell minWidth={ 324 }>
                        <LabeledInput label='Email' { ...contactsLens.prop('email').toProps() }>
                            <TextInput
                                { ...contactsLens.prop('email').toProps() }
                                icon={ mailIcon }
                                placeholder='your_mail@epam.com'
                            />
                        </LabeledInput>
                    </FlexCell>
                </FlexRow>
            </>
        );
    }

    renderPrimaryInfoSection = (lens: ILens<PersonDetails>) => {
        const primaryInfoLens = lens.prop('primaryInfo');
        return (
            <>
                <FlexRow >
                    <RichTextView><h3>Primary Info</h3></RichTextView>
                    <Tooltip trigger='hover' offset='0,3' content='You have no permission to edit this information'>
                        <IconContainer icon={ infoIcon } cx={ css.infoIcon } />
                    </Tooltip>
                </FlexRow>

                <FlexRow vPadding='12' spacing='18' alignItems='top'>
                    <LabeledInput label='Status' { ...primaryInfoLens.prop('status').toProps() }>
                        <TextInput
                            { ...primaryInfoLens.prop('status').toProps() }
                            placeholder='Select Status'
                        />
                    </LabeledInput>
                    <LabeledInput label='Production Category' { ...primaryInfoLens.prop('productionCategory').toProps() }>
                        <TextInput
                            { ...primaryInfoLens.prop('productionCategory').toProps() }
                            placeholder='Select Category'
                        />
                    </LabeledInput>
                </FlexRow>
                <FlexRow vPadding='12' spacing='18' alignItems='top'>
                    <FlexCell minWidth={ 324 }>
                        <LabeledInput label='Organizational category' { ...primaryInfoLens.prop('organizationalCategory').toProps() }>
                            <TextInput
                                { ...primaryInfoLens.prop('organizationalCategory').toProps() }
                                placeholder='Select Organizational Category'
                            />
                        </LabeledInput>
                    </FlexCell>
                    <FlexRow spacing='18'>
                        <FlexCell minWidth={ 186 }>
                            <LabeledInput label='Job Function' { ...primaryInfoLens.prop('jobFunction').toProps() }>
                                <TextInput
                                    { ...primaryInfoLens.prop('jobFunction').toProps() }
                                    placeholder='Select Job Function'
                                />
                            </LabeledInput>
                        </FlexCell>
                        <FlexCell minWidth={ 120 }>
                            <LabeledInput label='Job Function Level' { ...primaryInfoLens.prop('jobFunctionLevel').toProps() }>
                                <TextInput
                                    { ...primaryInfoLens.prop('jobFunctionLevel').toProps() }
                                    placeholder='Select Level'
                                />
                            </LabeledInput>
                        </FlexCell>
                    </FlexRow>
                </FlexRow>
                <FlexRow vPadding='12' spacing='18' alignItems='top'>
                    <FlexCell minWidth={ 324 }>
                        <FlexRow spacing='18'>
                            <FlexCell minWidth={ 120 }>
                                <LabeledInput label='Current Project' { ...primaryInfoLens.prop('currentProject').toProps() }>
                                    <TextInput
                                        { ...primaryInfoLens.prop('currentProject').toProps() }
                                        placeholder='Select Project'
                                    />
                                </LabeledInput>
                            </FlexCell>
                            <FlexCell minWidth={ 186 }>
                                <LabeledInput label='Role' { ...primaryInfoLens.prop('projectRole').toProps() }>
                                    <TextInput
                                        { ...primaryInfoLens.prop('projectRole').toProps() }
                                        placeholder='Select Role'
                                    />
                                </LabeledInput>
                            </FlexCell>
                        </FlexRow>
                    </FlexCell>
                    <FlexRow size='48' spacing='18' alignItems='bottom'>
                        <Switch label='Time Reporting' { ...primaryInfoLens.prop('timeReporting').toProps() } isDisabled />
                        <Switch label='Remote' { ...primaryInfoLens.prop('remoteStatus').toProps() } isDisabled />
                    </FlexRow>
                </FlexRow>
            </>
        );
    }

    renderEducationSection = (lens: ILens<PersonDetails>) => {
        const educationLens = lens.prop('education');
        return (
            <>
                <RichTextView><h3>Education</h3></RichTextView>

                <FlexRow vPadding='12'>
                    <FlexCell minWidth={ 324 }>
                        <LabeledInput label='Institution' { ...educationLens.prop('institution').toProps() }>
                            <PickerInput
                                { ...educationLens.prop('institution').toProps() }
                                dataSource={ this.institutionLevelsDataSource }
                                selectionMode='single'
                                getName={ item => item.university.split(' / ')[0] }
                                sorting={ { field: 'university', direction: 'asc' } }
                                valueType='id'
                                placeholder='Select Institution'
                            />
                        </LabeledInput>
                    </FlexCell>
                </FlexRow>
                <FlexRow vPadding='12' spacing='18' alignItems='top'>
                    <LabeledInput label='Faculty' { ...educationLens.prop('faculty').toProps() }>
                        <TextInput
                            { ...educationLens.prop('faculty').toProps() }
                            placeholder='Faculty Name'
                        />
                    </LabeledInput>
                    <LabeledInput label='Department' { ...educationLens.prop('department').toProps() }>
                        <TextInput
                            { ...educationLens.prop('department').toProps() }
                            placeholder='Department Name'
                        />
                    </LabeledInput>
                </FlexRow>
                <FlexRow vPadding='12' spacing='18' alignItems='top'>
                    <LabeledInput label='Degree' { ...educationLens.prop('degree').toProps() }>
                        <TextInput
                            { ...educationLens.prop('degree').toProps() }
                            placeholder='Degree Name'
                        />
                    </LabeledInput>
                    <LabeledInput label='Speciality' { ...educationLens.prop('speciality').toProps() }>
                        <TextInput
                            { ...educationLens.prop('speciality').toProps() }
                            placeholder='Speciality Name'
                        />
                    </LabeledInput>
                </FlexRow>
                <FlexRow vPadding='12' spacing='18'>
                    <FlexCell minWidth={ 120 } >
                        <LabeledInput label='Graduation year' { ...educationLens.prop('graduationYear').toProps() }>
                            <NumericInput
                                { ...educationLens.prop('graduationYear').toProps() }
                                min={ 1950 }
                                max={ 2020 }
                                placeholder='2020'
                            />
                        </LabeledInput>
                    </FlexCell>
                </FlexRow>
            </>
        );
    }

    renderLanguageSection = (lens: ILens<PersonDetails>) => {
        const emptyLangInfo: PersonLanguageInfo = { language: null, writingLevel: null, speakingLevel: null };
        const langLens = lens.prop('languageInfo').default([emptyLangInfo]);
        return (
            <>
                <RichTextView><h3>Languages</h3></RichTextView>
                { langLens.get().map((value, index) => {
                    let langLensItem = langLens.index(index);
                    let isClearable = index !== 0 || value.language || value.speakingLevel || value.writingLevel;

                    return (
                        <FlexRow key={ index } vPadding='12' spacing='18' alignItems='top'>
                            <FlexCell minWidth={ 186 }>
                                <LabeledInput label='Language' { ...langLensItem.prop('language').toProps() } >
                                    <PickerInput
                                        { ...langLensItem.prop('language').toProps() }
                                        dataSource={ this.languageDataSource }
                                        selectionMode='single'
                                        valueType='id'
                                        placeholder='Select Language'
                                    />
                                </LabeledInput>
                            </FlexCell>
                            <FlexCell minWidth={ 120 }>
                                <LabeledInput label='Speaking' { ...langLensItem.prop('speakingLevel').toProps() } >
                                    <PickerInput
                                        { ...langLensItem.prop('speakingLevel').toProps() }
                                        dataSource={ this.languageLevelsDataSource }
                                        selectionMode='single'
                                        valueType='id'
                                        placeholder='Select Level'
                                        getName={ item => item.level }
                                    />
                                </LabeledInput>
                            </FlexCell>
                            <FlexCell minWidth={ 120 }>
                                <LabeledInput label='Writing' { ...langLensItem.prop('writingLevel').toProps() } >
                                    <PickerInput
                                        { ...langLensItem.prop('writingLevel').toProps() }
                                        dataSource={ this.languageLevelsDataSource }
                                        selectionMode='single'
                                        valueType='id'
                                        placeholder='Select Level'
                                        getName={ item => item.level }
                                    />
                                </LabeledInput>
                            </FlexCell>
                            <FlexRow size='48' alignItems='bottom' cx={ css.clearButtonWrapper }>
                                { isClearable && <IconButton icon={ clearIcon } onClick={ () => this.removeLensItemHandler(langLens, index) }/> }
                            </FlexRow>
                        </FlexRow>
                    );
                })
                }
                <FlexRow vPadding='12'>
                    <Button onClick={ () => this.addLensItemHandler(langLens, emptyLangInfo) }  caption='Add One More' icon={ addIcon } fill='none' />
                </FlexRow>
            </>
        );
    }

    renderVisasSection = (lens: ILens<PersonDetails>) => {
        const emptyVisa: PersonTravelVisa = { country: null, term: null };
        const visasLens = lens.prop('travelVisas').prop('visas').default([emptyVisa]);
        const scansLens = Lens.onEditable(lens.prop('travelVisas').prop('scans').toProps()).default([]);

        return (
            <>
                <RichTextView><h3>Travel Visas</h3></RichTextView>

                {
                    visasLens.get().map((value, index) => {
                        let isClearable = index !== 0 || value.country || value.term;
                        return (
                            <FlexRow key={ index } vPadding='12' spacing='18' alignItems='top' >
                                <FlexCell minWidth={ 324 }>
                                    <LabeledInput label='Country' { ...visasLens.index(index).prop('country').toProps() } >
                                        <PickerInput
                                            { ...visasLens.index(index).prop('country').toProps() }
                                            dataSource={ this.countriesDataSource }
                                            selectionMode='single'
                                            valueType='id'
                                            placeholder='Select Country'
                                        />
                                    </LabeledInput>
                                </FlexCell>
                                <FlexCell minWidth={ 294 }>
                                    <LabeledInput label='Term' { ...visasLens.index(index).prop('term').toProps() } >
                                        <RangeDatePicker { ...visasLens.index(index).prop('term').toProps() } />
                                    </LabeledInput>
                                </FlexCell>
                                <FlexRow size='48' alignItems='bottom' cx={ css.clearButtonWrapper }>
                                    { isClearable && <IconButton icon={ clearIcon } onClick={ () => this.removeLensItemHandler(visasLens, index) }/> }
                                </FlexRow>
                            </FlexRow>
                        );
                    })
                }
                <FlexRow vPadding='12'>
                    <Button onClick={ () => this.addLensItemHandler(visasLens, emptyVisa) }  caption='Add One More' icon={ addIcon } fill='none' />
                </FlexRow>
                <FlexRow vPadding='12' spacing='18' >
                    <FlexCell width='100%'>
                        <LabeledInput label='Scans' >
                            <DropSpot infoText='Up to 20 files. Limit for 1 file is 5 MB' onUploadFiles={ (files) => this.uploadFile(files, scansLens) } />
                            <div className={ scansLens.get().length && css.attachmentContainer } >
                                {
                                    scansLens.get().map((i, index) =>
                                        <FileCard key={ index } file={ i } onClick={ () => this.removeLensItemHandler(scansLens, index) } />)
                                }
                            </div>
                        </LabeledInput>
                    </FlexCell>
                </FlexRow>
            </>
        );
    }

    renderMilitaryServiceSection = (lens: ILens<PersonDetails>) => {
        const militaryServiceLens = lens.prop('militaryService');
        return (
            <>
                <RichTextView><h3 className={ css.militaryServiceSection }>Military Service</h3></RichTextView>

                <FlexRow vPadding='12' size='24' spacing='18' alignItems='top' >
                    <Switch label='Has military ID' { ...militaryServiceLens.prop('hasMilitaryId').toProps() } />
                    <Switch label='Served in the ARMY' { ...militaryServiceLens.prop('servedInTheArmy').toProps() } />
                    <Switch label='Eligible to serve the ARMY' { ...militaryServiceLens.prop('eligibleToServeTheArmy').toProps() } />
                </FlexRow>
                <FlexRow vPadding='12' >
                    <FlexCell width='100%' >
                        <LabeledInput label='Other Info' { ...militaryServiceLens.prop('otherMilitaryInfo').toProps() } >
                            <TextArea
                                { ...militaryServiceLens.prop('otherMilitaryInfo').toProps() }
                                placeholder='Type something'
                            />
                        </LabeledInput>
                    </FlexCell>
                </FlexRow>
            </>
        );
    }

    renderOtherInfoSection = (lens: ILens<PersonDetails>) => {
        const otherInfoLens = lens.prop('otherInfo');
        return (
            <>
                <RichTextView><h3>Other Info</h3></RichTextView>

                <FlexRow vPadding='12'>
                    <FlexCell width='auto'>
                        <LabeledInput label='T-Shirt Size' { ...otherInfoLens.prop('tShirtSize').toProps() } >
                            <MultiSwitch
                                items={ tShirtSizes }
                                { ...otherInfoLens.prop('tShirtSize').toProps() }
                            />
                        </LabeledInput>
                    </FlexCell>
                </FlexRow>
            </>
        );
    }

    renderForm = (props: RenderFormProps<PersonDetails>) => {
        let lens = props.lens;

        return (
            <div className={ css.root }>
                <FlexRow size='48'>
                    <RichTextView><h2>My Profile</h2></RichTextView>
                    <FlexSpacer />
                </FlexRow>
                <Panel cx={ css.formPanel } background='white' shadow>
                    <FlexCell width='100%'>
                        { this.renderPersonalInfoSection(lens) }
                        { this.renderLocationSection(lens) }
                        { this.renderContactsSection(lens) }
                        { this.renderPrimaryInfoSection(lens) }
                        { this.renderEducationSection(lens) }
                        { this.renderLanguageSection(lens) }
                        { this.renderVisasSection(lens) }
                        { this.renderMilitaryServiceSection(lens) }
                        { this.renderOtherInfoSection(lens) }
                        <div className={ css.divider }> </div>
                        <FlexRow>
                            <FlexSpacer />
                            <Button caption='Save' color='green' onClick={ props.save } />
                        </FlexRow>
                    </FlexCell>
                </Panel>
            </div>
        );
    }

    render() {
        return (
            <Form<PersonDetails>
                getMetadata={ this.getMetaData }
                onSave={ (person) => Promise.resolve({ form: person }) }
                onSuccess={ (person) => {
                    this.setState({ ...this.state, person: person });

                    return svc.uuiNotifications.show((props) =>
                        <SuccessNotification { ...props }>
                            <Text size='36' font='sans' fontSize='14'>Data has been saved!</Text>
                        </SuccessNotification>, { duration: 2 });
                } }
                renderForm={ this.renderForm }
                value={ this.state.person }
            />
        );
    }
}