'use client';

import {
  FlexCell,
  FlexRow,
  FlexSpacer,
  LabeledInput,
  Panel,
  PickerInput,
  RichTextView,
  SuccessNotification,
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
} from '@epam/promo';
import css from '../../styles/DemoForm.module.scss';
import {
  AsyncDataSource,
  ILens,
  Lens,
  useArrayDataSource,
  useAsyncDataSource,
  useLazyDataSource,
  useUuiContext,
  UuiContexts,
} from '@epam/uui-core';
import { Country, demoData } from '@epam/uui-docs';
import infoIcon from '@epam/assets/icons/common/notification-help-outline-24.svg';
import addIcon from '@epam/assets/icons/common/action-add-18.svg';
import clearIcon from '@epam/assets/icons/common/navigation-close-24.svg';
import { TApi } from '../../helpers/apiDefinition';
import {
  Attachment,
  PersonDetails,
  PersonLanguageInfo,
  PersonTravelVisa,
} from '../../demoData/models/types';
import { emptyInfo, defaultData } from '../../demoData/defaultFormData';
import { personDetailsSchema } from '../../demoData/schemas/validationShema';
import { withErrorHandle } from '../../components/withErrorHandle';

const tShirtSizes = [
  { id: 1, caption: 'XS' },
  { id: 2, caption: 'S' },
  { id: 3, caption: 'M' },
  { id: 4, caption: 'L' },
  { id: 5, caption: 'XL' },
];

function removeLensItemHandler<T>(lens: ILens<T[]>, index: number) {
  return lens.set(lens.get().filter((_, i: number) => index !== i));
}

function addLensItemHandler<T>(lens: ILens<T[]>, item: T) {
  return lens.set(lens.get().concat(item));
}

const PersonalInfo = ({
  lens,
}: {
  lens: ILens<PersonDetails['personalInfo']>;
}) => {
  if (!lens) return null;
  return (
    <>
      <RichTextView>
        <h2 className={css.sectionTitle}>Personal Info</h2>
      </RichTextView>

      <FlexRow vPadding='12'>
        <FlexCell minWidth={324}>
          <LabeledInput
            htmlFor='fullName'
            label='Full Name'
            {...lens.prop('fullName').toProps()}
          >
            <TextInput
              {...lens.prop('fullName').toProps()}
              id='fullName'
              placeholder='Ivan Petrov'
            />
          </LabeledInput>
        </FlexCell>
      </FlexRow>
      <FlexRow vPadding='12'>
        <FlexCell width='auto'>
          <LabeledInput
            htmlFor='birthDate'
            label='Date of Birth'
            {...lens.prop('birthdayDate').toProps()}
          >
            <DatePicker
              rawProps={{ input: { id: 'birthDate' } }}
              format='DD/MM/YYYY'
              {...lens.prop('birthdayDate').toProps()}
            />
          </LabeledInput>
        </FlexCell>
      </FlexRow>
    </>
  );
};

const Location = ({
  lens,
  countriesDS,
}: {
  lens: ILens<PersonDetails['location']>;
  countriesDS: AsyncDataSource<Country, string, unknown>;
}) => {
  const svc = useUuiContext<TApi, UuiContexts>();

  const citiesDataSource = useLazyDataSource(
    {
      api: svc.api.demo.cities,
    },
    []
  );

  return (
    <>
      <RichTextView>
        <h3>Location</h3>
      </RichTextView>

      <FlexRow
        vPadding='12'
        columnGap='18'
        alignItems='top'
      >
        <LabeledInput
          htmlFor='country'
          label='Country'
          {...lens.prop('country').toProps()}
        >
          <PickerInput
            {...lens.prop('country').toProps()}
            dataSource={countriesDS}
            value={lens.prop('country').toProps().value} // || 'DZ' }
            selectionMode='single'
            valueType='id'
            rawProps={{ input: { id: 'country' } }}
            placeholder='Select Country'
            onValueChange={(value) => lens.set({ country: value as string })}
          />
        </LabeledInput>
        <LabeledInput
          htmlFor='city'
          label='City'
          {...lens.prop('city').toProps()}
        >
          <PickerInput
            {...lens.prop('city').toProps()}
            selectionMode='single'
            valueType='id'
            rawProps={{ input: { id: 'city' } }}
            dataSource={citiesDataSource}
            filter={{ country: lens.prop('country').get() }}
            placeholder='Select City'
          />
        </LabeledInput>
      </FlexRow>
    </>
  );
};

const PrimaryInfo = ({
  lens,
}: {
  lens: ILens<PersonDetails['primaryInfo']>;
}) => (
  <>
    <FlexRow>
      <RichTextView>
        <h3>Primary Info</h3>
      </RichTextView>
      <Tooltip
        offset={[0, 3]}
        content='You have no permission to edit this information'
      >
        <IconContainer
          icon={infoIcon}
          cx={css.infoIcon}
        />
      </Tooltip>
    </FlexRow>

    <FlexRow
      vPadding='12'
      columnGap='18'
      alignItems='top'
    >
      <LabeledInput
        htmlFor='status'
        label='Status'
        {...lens.prop('status').toProps()}
      >
        <TextInput
          {...lens.prop('status').toProps()}
          placeholder='Select Status'
          id='status'
        />
      </LabeledInput>
      <LabeledInput
        htmlFor='productionCategory'
        label='Production Category'
        {...lens.prop('productionCategory').toProps()}
      >
        <TextInput
          {...lens.prop('productionCategory').toProps()}
          placeholder='Select Category'
          id='productionCategory'
        />
      </LabeledInput>
    </FlexRow>
    <FlexRow
      vPadding='12'
      columnGap='18'
      alignItems='top'
    >
      <FlexCell minWidth={324}>
        <LabeledInput
          htmlFor='organizationalCategory'
          label='Organizational category'
          {...lens.prop('organizationalCategory').toProps()}
        >
          <TextInput
            {...lens.prop('organizationalCategory').toProps()}
            placeholder='Select Organizational Category'
            id='organizationalCategory'
          />
        </LabeledInput>
      </FlexCell>
      <FlexRow spacing='18'>
        <FlexCell minWidth={186}>
          <LabeledInput
            htmlFor='jobFunction'
            label='Job Function'
            {...lens.prop('jobFunction').toProps()}
          >
            <TextInput
              {...lens.prop('jobFunction').toProps()}
              placeholder='Select Job Function'
              id='jobFunction'
            />
          </LabeledInput>
        </FlexCell>
        <FlexCell minWidth={120}>
          <LabeledInput
            htmlFor='jobFunctionLevel'
            label='Job Function Level'
            {...lens.prop('jobFunctionLevel').toProps()}
          >
            <TextInput
              {...lens.prop('jobFunctionLevel').toProps()}
              placeholder='Select Level'
              id='jobFunctionLevel'
            />
          </LabeledInput>
        </FlexCell>
      </FlexRow>
    </FlexRow>
    <FlexRow
      vPadding='12'
      columnGap='18'
      alignItems='top'
    >
      <FlexCell minWidth={324}>
        <FlexRow columnGap='18'>
          <FlexCell minWidth={120}>
            <LabeledInput
              htmlFor='currentProject'
              label='Current Project'
              {...lens.prop('currentProject').toProps()}
            >
              <TextInput
                {...lens.prop('currentProject').toProps()}
                placeholder='Select Project'
                id='currentProject'
              />
            </LabeledInput>
          </FlexCell>
          <FlexCell minWidth={186}>
            <LabeledInput
              htmlFor='projectRole'
              label='Role'
              {...lens.prop('projectRole').toProps()}
            >
              <TextInput
                {...lens.prop('projectRole').toProps()}
                placeholder='Select Role'
                id='projectRole'
              />
            </LabeledInput>
          </FlexCell>
        </FlexRow>
      </FlexCell>
      <FlexRow
        size='48'
        columnGap='18'
        alignItems='bottom'
      >
        <Switch
          label='Time Reporting'
          {...lens.prop('timeReporting').toProps()}
          isDisabled
        />
        <Switch
          label='Remote'
          {...lens.prop('remoteStatus').toProps()}
          isDisabled
        />
      </FlexRow>
    </FlexRow>
  </>
);

const Education = ({ lens }: { lens: ILens<PersonDetails['education']> }) => {
  const institutionLevelsDataSource = useArrayDataSource(
    {
      items: demoData.universities,
    },
    []
  );

  return (
    <>
      <RichTextView>
        <h3>Education</h3>
      </RichTextView>

      <FlexRow vPadding='12'>
        <FlexCell minWidth={324}>
          <LabeledInput
            htmlFor='institution'
            label='Institution'
            {...lens.prop('institution').toProps()}
          >
            <PickerInput
              {...lens.prop('institution').toProps()}
              dataSource={institutionLevelsDataSource}
              selectionMode='single'
              rawProps={{ input: { id: 'institution' } }}
              getName={(item) => item.university.split(' / ')[0]}
              sorting={{ field: 'university', direction: 'asc' }}
              valueType='id'
              placeholder='Select Institution'
            />
          </LabeledInput>
        </FlexCell>
      </FlexRow>
      <FlexRow
        vPadding='12'
        columnGap='18'
        alignItems='top'
      >
        <LabeledInput
          htmlFor='faculty'
          label='Faculty'
          {...lens.prop('faculty').toProps()}
        >
          <TextInput
            {...lens.prop('faculty').toProps()}
            placeholder='Faculty Name'
            id='faculty'
          />
        </LabeledInput>
        <LabeledInput
          htmlFor='department'
          label='Department'
          {...lens.prop('department').toProps()}
        >
          <TextInput
            {...lens.prop('department').toProps()}
            placeholder='Department Name'
            id='department'
          />
        </LabeledInput>
      </FlexRow>
      <FlexRow
        vPadding='12'
        columnGap='18'
        alignItems='top'
      >
        <LabeledInput
          htmlFor='degree'
          label='Degree'
          {...lens.prop('degree').toProps()}
        >
          <TextInput
            {...lens.prop('degree').toProps()}
            placeholder='Degree Name'
            id='degree'
          />
        </LabeledInput>
        <LabeledInput
          htmlFor='speciality'
          label='Speciality'
          {...lens.prop('speciality').toProps()}
        >
          <TextInput
            {...lens.prop('speciality').toProps()}
            placeholder='Speciality Name'
            id='speciality'
          />
        </LabeledInput>
      </FlexRow>
      <FlexRow
        vPadding='12'
        columnGap='18'
      >
        <FlexCell minWidth={120}>
          <LabeledInput
            htmlFor='graduationYear'
            label='Graduation year'
            {...lens.prop('graduationYear').toProps()}
          >
            <NumericInput
              {...lens.prop('graduationYear').toProps()}
              min={1950}
              max={2020}
              placeholder='2020'
              id='graduationYear'
            />
          </LabeledInput>
        </FlexCell>
      </FlexRow>
    </>
  );
};

const Languages = ({
  lens,
}: {
  lens: ILens<PersonDetails['languageInfo']>;
}) => {
  const svc = useUuiContext<TApi, UuiContexts>();

  const languageDataSource = useAsyncDataSource(
    {
      api: () => svc.api.demo.languages({}).then((r) => r.items),
    },
    []
  );

  const languageLevelsDataSource = useArrayDataSource(
    {
      items: demoData.languageLevels,
    },
    []
  );

  return (
    <>
      <RichTextView>
        <h3>Languages</h3>
      </RichTextView>
      {lens.get().map(({ language, speakingLevel, writingLevel }, index) => {
        const lensItem = lens.index(index);
        const isClearable =
          index !== 0 || language || speakingLevel || writingLevel;

        return (
          <FlexRow
            key={index}
            vPadding='12'
            spacing='18'
            alignItems='top'
          >
            <FlexCell minWidth={186}>
              <LabeledInput
                htmlFor={`language-${index}`}
                label='Language'
                {...lensItem.prop('language').toProps()}
              >
                <PickerInput
                  {...lensItem.prop('language').toProps()}
                  dataSource={languageDataSource}
                  selectionMode='single'
                  valueType='id'
                  rawProps={{
                    input: { id: `language-${index}` },
                  }}
                  placeholder='Select Language'
                />
              </LabeledInput>
            </FlexCell>
            <FlexCell minWidth={120}>
              <LabeledInput
                htmlFor={`speakingLevel-${index}`}
                label='Speaking'
                {...lensItem.prop('speakingLevel').toProps()}
              >
                <PickerInput
                  {...lensItem.prop('speakingLevel').toProps()}
                  dataSource={languageLevelsDataSource}
                  selectionMode='single'
                  valueType='id'
                  rawProps={{
                    input: {
                      id: `speakingLevel-${index}`,
                    },
                  }}
                  placeholder='Select Level'
                  getName={(item) => item.level}
                />
              </LabeledInput>
            </FlexCell>
            <FlexCell minWidth={120}>
              <LabeledInput
                htmlFor={`writingLevel-${index}`}
                label='Writing'
                {...lensItem.prop('writingLevel').toProps()}
              >
                <PickerInput
                  {...lensItem.prop('writingLevel').toProps()}
                  dataSource={languageLevelsDataSource}
                  selectionMode='single'
                  valueType='id'
                  rawProps={{
                    input: {
                      id: `writingLevel-${index}`,
                    },
                  }}
                  placeholder='Select Level'
                  getName={(item) => item.level}
                />
              </LabeledInput>
            </FlexCell>
            <FlexRow
              size='48'
              alignItems='bottom'
              cx={css.clearButtonWrapper}
            >
              {isClearable && (
                <IconButton
                  icon={clearIcon}
                  onClick={() =>
                    removeLensItemHandler<PersonLanguageInfo>(lens, index)
                  }
                />
              )}
            </FlexRow>
          </FlexRow>
        );
      })}
      <FlexRow vPadding='12'>
        <Button
          onClick={() =>
            addLensItemHandler<PersonLanguageInfo>(lens, emptyInfo.language)
          }
          caption='Add One More'
          icon={addIcon}
          fill='none'
        />
      </FlexRow>
    </>
  );
};

const Visas = ({
  lens,
  countriesDS,
}: {
  lens: ILens<PersonDetails['travelVisas']>;
  countriesDS: AsyncDataSource<Country, string, unknown>;
}) => {
  const svc = useUuiContext<TApi, UuiContexts>();
  const visasLens = lens.prop('visas').default([emptyInfo.visa]);
  const scansLens = Lens.onEditable(lens.prop('scans').toProps()).default([]);

  const uploadFile = (files: File[], lens: ILens<Attachment[]>) => {
    let tempIdCounter = 0;
    const attachments = lens.default([]).get();

    const updateAttachment = (newFile: Attachment, id: number) => {
      lens.set(attachments.map((i) => (i.id === id ? newFile : i)));
    };

    const trackProgress = (progress: number, id: number) => {
      const file = attachments.find((i) => i.id === id);
      if (!file || !file.id) return;
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
      svc.uuiApi
        .uploadFile('/uploadFileMock', file, {
          onProgress: (progress) => trackProgress(progress, tempId),
        })
        .then((res) => {
          updateAttachment({ ...res, progress: 100 }, tempId);
        });
    });

    lens.set(attachments);
  };

  return (
    <>
      <RichTextView>
        <h3>Travel Visas</h3>
      </RichTextView>

      {visasLens.get().map((value, index) => {
        const isClearable = index !== 0 || value.country || value.term;
        return (
          <FlexRow
            key={index}
            vPadding='12'
            spacing='18'
            alignItems='top'
          >
            <FlexCell minWidth={324}>
              <LabeledInput
                htmlFor={`travelVisasCountry-${index}`}
                label='Country'
                {...visasLens.index(index).prop('country').toProps()}
              >
                <PickerInput
                  {...visasLens.index(index).prop('country').toProps()}
                  dataSource={countriesDS}
                  selectionMode='single'
                  valueType='id'
                  rawProps={{
                    input: {
                      id: `travelVisasCountry-${index}`,
                    },
                  }}
                  placeholder='Select Country'
                />
              </LabeledInput>
            </FlexCell>
            <FlexCell minWidth={294}>
              <LabeledInput
                label='Term'
                {...visasLens.index(index).prop('term').toProps()}
              >
                <RangeDatePicker
                  {...visasLens.index(index).prop('term').toProps()}
                />
              </LabeledInput>
            </FlexCell>
            <FlexRow
              size='48'
              alignItems='bottom'
              cx={css.clearButtonWrapper}
            >
              {isClearable && (
                <IconButton
                  icon={clearIcon}
                  onClick={() =>
                    removeLensItemHandler<PersonTravelVisa>(visasLens, index)
                  }
                />
              )}
            </FlexRow>
          </FlexRow>
        );
      })}
      <FlexRow vPadding='12'>
        <Button
          onClick={() =>
            addLensItemHandler<PersonTravelVisa>(visasLens, emptyInfo.visa)
          }
          caption='Add One More'
          icon={addIcon}
          fill='none'
        />
      </FlexRow>
      <FlexRow
        vPadding='12'
        columnGap='18'
      >
        <FlexCell width='100%'>
          <LabeledInput label='Scans'>
            <DropSpot
              infoText='Up to 20 files. Limit for 1 file is 5 MB'
              onUploadFiles={(files) => uploadFile(files, scansLens)}
            />
            <div
              className={scansLens.get().length ? css.attachmentContainer : ''}
            >
              {scansLens.get().map((i, index) => (
                <FileCard
                  key={index}
                  file={i}
                  onClick={() =>
                    removeLensItemHandler<Attachment>(scansLens, index)
                  }
                />
              ))}
            </div>
          </LabeledInput>
        </FlexCell>
      </FlexRow>
    </>
  );
};

const OtherInfo = ({ lens }: { lens: ILens<PersonDetails['otherInfo']> }) => (
  <>
    <RichTextView>
      <h3>Other Info</h3>
    </RichTextView>

    <FlexRow vPadding='12'>
      <FlexCell width='auto'>
        <LabeledInput
          label='T-Shirt Size'
          {...lens.prop('tShirtSize').toProps()}
        >
          <MultiSwitch
            items={tShirtSizes}
            {...lens.prop('tShirtSize').toProps()}
          />
        </LabeledInput>
      </FlexCell>
    </FlexRow>
  </>
);

const DemoForm = () => {
  const svc = useUuiContext<TApi, UuiContexts>();

  const { lens, save } = useForm<PersonDetails>({
    settingsKey: 'next-js_demo-form',
    value: defaultData,
    getMetadata: personDetailsSchema,
    onSave: (person) => Promise.resolve({ form: person }),
    onSuccess: () =>
      svc.uuiNotifications
        .show(
          (props) => (
            <SuccessNotification {...props}>
              <Text
                size='36'
                fontSize='14'
              >
                Data has been saved!
              </Text>
            </SuccessNotification>
          ),
          { duration: 2 }
        )
        .catch(() => null),
  });

  const countriesDS = useAsyncDataSource<Country, string, unknown>(
    {
      api: () =>
        svc.api.demo
          .countries({ sorting: [{ field: 'name' }] })
          .then((r) => r.items),
    },
    []
  );

  return (
    <div>
      <FlexRow size='48'>
        <RichTextView>
          <h1>My Profile</h1>
        </RichTextView>
        <FlexSpacer />
      </FlexRow>
      <Panel
        background='white'
        shadow
        cx={css.container}
      >
        <FlexCell width='100%'>
          <PersonalInfo lens={lens.prop('personalInfo')} />
          <Location
            lens={lens.prop('location')}
            countriesDS={countriesDS}
          />
          <PrimaryInfo lens={lens.prop('primaryInfo')} />
          <Education lens={lens.prop('education')} />
          <Languages
            lens={lens.prop('languageInfo').default([emptyInfo.language])}
          />
          <Visas
            lens={lens.prop('travelVisas')}
            countriesDS={countriesDS}
          />
          <OtherInfo lens={lens.prop('otherInfo')} />
          <hr className={css.divider} />
          <FlexRow spacing='12'>
            <FlexSpacer />
            {/*<Button caption='Validate' color='blue' onClick={ validate } />*/}
            <Button
              caption='Save'
              color='green'
              onClick={save}
            />
          </FlexRow>
        </FlexCell>
      </Panel>
    </div>
  );
};

export default withErrorHandle(DemoForm);
