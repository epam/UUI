import * as React from 'react';
import css from './ComplexForm.scss';
import {
    Panel,
    FlexRow,
    FlexCell,
    LabeledInput,
    TextInput,
    PickerInput,
    DatePicker,
    ControlWrapper,
    RadioGroup,
    CheckboxGroup,
    Rating,
    TextArea,
    NumericInput,
    RangeDatePicker,
    Slider,
    RangeSlider,
    Blocker,
    DropSpotRenderParams,
    Text,
    DropSpot,
    UploadFileToggler,
    LinkButton,
    TimePicker,
} from '@epam/loveship';
import { ILens, cx, LazyDataSource, ArrayDataSource, AsyncDataSource, FileUploadResponse } from '@epam/uui';
import { svc } from '../../services';
import { City, PersonDetails } from '@epam/uui-docs';
import { ExperienceEditor } from './ExperienceEditor';

interface PersonDetailEditorProps {
    lens: ILens<PersonDetails>;
    isDisabled: boolean;
    isReadOnly: boolean;
    isBlocked: boolean;
}

type Attachment = { progress?: number } & FileUploadResponse;

export class PersonDetailEditor extends React.Component<PersonDetailEditorProps> {
    trackProgress(progress: number, id: number) {
        const attachments = this.props.lens.prop('attachments').get();
        const file = attachments.find(i => i.id === id);
        file.progress = progress;
        this.updateAttachment(file, file.id);
    }

    updateAttachment(newFile: Attachment, id: number) {
        const attachments = this.props.lens.prop('attachments').get();
        this.props.lens.prop('attachments').set(attachments.map(i => (i.id === id ? newFile : i)));
    }

    uploadFile = (files: File[]) => {
        const attachments = this.props.lens.prop('attachments').default([]).get();

        files.map((file, index) => {
            const tempId = index - 1;

            attachments.push({ id: tempId, name: file.name, size: file.size });

            svc.uuiApi
                .uploadFile('/uploadFileMock', file, {
                    onProgress: progress => this.trackProgress(progress, tempId),
                })
                .then(res => {
                    this.updateAttachment(res, tempId);
                });
        });

        this.props.lens.prop('attachments').set(attachments);
    };

    renderAttachmentSection = (props: DropSpotRenderParams) => {
        return (
            <div className={css.block}>
                <div className={cx(css.attachmentBlock, props.isDragStart && css.dropStart)}>
                    {props.isDragStart ? (
                        <div {...props.eventHandlers} className={css.dropArea}>
                            <img className={css.dropImg} src="/grow/static/images/attachment_area.svg" />
                            <div className={css.dropText}>Drop to attach file</div>
                        </div>
                    ) : (
                        <FlexRow spacing={null}>
                            <UploadFileToggler
                                onFilesAdded={this.uploadFile}
                                render={props => <LinkButton font="sans-semibold" {...props} caption="Attach " />}
                            />
                            <Text font="sans-semibold">{' or drop files here'}</Text>
                        </FlexRow>
                    )}
                </div>
            </div>
        );
    };

    renderAttachment() {
        const attachments = this.props.lens.get().attachments;

        return (
            <div>
                <DropSpot render={this.renderAttachmentSection} onFilesDropped={this.uploadFile} />
                {attachments &&
                    attachments.map(i => (
                        <Text lineHeight="24" size="30">
                            {i.name} {i.progress}
                        </Text>
                    ))}
            </div>
        );
    }

    lazyDs = new LazyDataSource({
        api: svc.api.demo.cities,
    });

    arrayDs = new ArrayDataSource({
        items: new Array(50)
            .fill(0)
            .map((item, index) => (2018 - index).toString())
            .map(name => ({ id: name, name })),
    });

    asyncLocationsDs = new AsyncDataSource({
        api: () => svc.api.demo.locations({}).then(r => r.items),
    });

    render() {
        return (
            <div className={css.horizontal}>
                <Panel>
                    <FlexRow type="form">
                        <FlexCell grow={1}>
                            <LabeledInput htmlFor="city" label="City" {...this.props.lens.prop('city').toProps()}>
                                <PickerInput<City, string>
                                    {...this.props.lens.prop('city').toProps()}
                                    selectionMode="multi"
                                    valueType="id"
                                    rawProps={{ input: { id: 'city' } }}
                                    dataSource={this.lazyDs}
                                    getName={c => c.name}
                                />
                            </LabeledInput>
                        </FlexCell>
                        <FlexCell grow={1}>
                            <LabeledInput htmlFor="country" label="Country" {...this.props.lens.prop('countryId').toProps()}>
                                {
                                    <PickerInput
                                        {...this.props.lens.prop('countries').toProps()}
                                        selectionMode="multi"
                                        valueType="id"
                                        rawProps={{ input: { id: 'country' } }}
                                        dataSource={this.asyncLocationsDs}
                                        getName={c => c.name}
                                    />
                                }
                            </LabeledInput>
                        </FlexCell>
                    </FlexRow>
                    <FlexRow type="form">
                        <FlexCell grow={1}>
                            <LabeledInput label="Middle Name" htmlFor="middleName" {...this.props.lens.prop('middleName').toProps()}>
                                <TextInput {...this.props.lens.prop('middleName').toProps()} id="middleName" />
                            </LabeledInput>
                        </FlexCell>
                        <FlexCell grow={1} minWidth={100}>
                            <LabeledInput htmlFor="birthDate" label="Birthday date" {...this.props.lens.prop('birthdayDate').toProps()}>
                                <DatePicker
                                    {...this.props.lens.prop('birthdayDate').toProps()}
                                    format="DD-MM-YYYY"
                                    rawProps={{ input: { id: 'birthDate' } }}
                                />
                            </LabeledInput>
                        </FlexCell>
                    </FlexRow>
                    <FlexRow type="form">
                        <FlexCell grow={1}>
                            <LabeledInput label="Last Name" htmlFor="lastName" {...this.props.lens.prop('lastName').toProps()}>
                                <TextInput id="lastName" {...this.props.lens.prop('lastName').toProps()} />
                            </LabeledInput>
                        </FlexCell>
                        <FlexCell grow={1}>
                            <LabeledInput label="Time" htmlFor="timeValue" {...this.props.lens.prop('timeValue').toProps()}>
                                <TimePicker id="timeValue" {...this.props.lens.prop('timeValue').toProps()} />
                            </LabeledInput>
                        </FlexCell>
                    </FlexRow>
                    <FlexRow type="form">
                        <FlexCell grow={1}>
                            <LabeledInput label="Sex" {...this.props.lens.prop('sex').toProps()}>
                                <ControlWrapper size="36">
                                    <RadioGroup
                                        items={[
                                            { id: 'male', name: 'Male' },
                                            { id: 'female', name: 'Female' },
                                        ]}
                                        {...this.props.lens.prop('sex').toProps()}
                                        direction="horizontal"
                                    />
                                </ControlWrapper>
                            </LabeledInput>
                        </FlexCell>
                        <FlexCell grow={1}>
                            <LabeledInput label="Role" {...this.props.lens.prop('roles').toProps()}>
                                <ControlWrapper size="36" cx={css.control}>
                                    <CheckboxGroup
                                        {...this.props.lens.prop('roles').toProps()}
                                        items={[
                                            { id: 'Admin', name: 'Admin' },
                                            { id: 'User', name: 'User' },
                                        ]}
                                        direction="horizontal"
                                    />
                                </ControlWrapper>
                            </LabeledInput>
                        </FlexCell>
                        <FlexCell grow={1}>
                            <LabeledInput label="Rating" {...this.props.lens.prop('rating').toProps()}>
                                <ControlWrapper size="36" cx={css.control}>
                                    <Rating {...this.props.lens.prop('rating').toProps()} rawProps={{ 'aria-label': 'Rating' }} />
                                </ControlWrapper>
                            </LabeledInput>
                        </FlexCell>
                    </FlexRow>
                    <FlexRow type="form">
                        <FlexCell grow={1}>
                            <LabeledInput htmlFor="notes" label="Notes" {...this.props.lens.prop('notes').toProps()}>
                                <TextArea {...this.props.lens.prop('notes').toProps()} rows={10} id="notes" />
                            </LabeledInput>
                        </FlexCell>
                    </FlexRow>
                </Panel>
                <Panel>
                    <FlexRow type="form">
                        <FlexCell grow={1}>
                            <LabeledInput htmlFor="vacDays" label="Vacation days" {...this.props.lens.prop('vacDays').toProps()}>
                                <NumericInput {...this.props.lens.prop('vacDays').toProps()} max={100} id="vacDays" min={0} step={1} />
                            </LabeledInput>
                        </FlexCell>
                        <FlexCell grow={1}>
                            <LabeledInput label="Vacation range" {...this.props.lens.prop('rangeDateValue').toProps()}>
                                <RangeDatePicker format="YYYY-MM-DD" {...this.props.lens.prop('rangeDateValue').toProps()} />
                            </LabeledInput>
                        </FlexCell>
                    </FlexRow>
                    <FlexRow type="form">
                        <FlexCell grow={1}>
                            <LabeledInput label="Slider" htmlFor="vacationDaysSlider" {...this.props.lens.prop('vacDays').toProps()}>
                                <Slider
                                    min={0}
                                    max={40}
                                    step={1}
                                    rawProps={{ 'aria-label': 'Vacation Days Slider', id: 'vacationDaysSlider' }}
                                    {...this.props.lens.prop('vacDays').toProps()}
                                />
                            </LabeledInput>
                        </FlexCell>
                        <FlexCell grow={1}>
                            <LabeledInput label="Range" {...this.props.lens.prop('bracket').toProps()}>
                                <RangeSlider min={-12} max={13} step={7} {...this.props.lens.prop('bracket').toProps()} />
                            </LabeledInput>
                        </FlexCell>
                    </FlexRow>
                    <ExperienceEditor {...this.props.lens.prop('experience').toProps()} />
                    <FlexRow type="form">
                        <LabeledInput label="Attachment">{this.renderAttachment()}</LabeledInput>
                    </FlexRow>
                    <Blocker isEnabled={this.props.isBlocked} />
                </Panel>
            </div>
        );
    }
}
