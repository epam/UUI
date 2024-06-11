import * as React from 'react';
import { useAsyncDataSource, ILens, Lens, useUuiContext, UuiContexts } from '@epam/uui-core';
import { Country } from '@epam/uui-docs';
import { ReactComponent as ClearIcon } from '@epam/assets/icons/common/navigation-close-24.svg';
import { ReactComponent as AddIcon } from '@epam/assets/icons/common/action-add-18.svg';
import {
    Button, DropSpot,
    ErrorNotification, FileCard, FlexCell, FlexRow, IconButton, LabeledInput, PickerInput, RangeDatePicker,
    RichTextView, Text,
} from '@epam/uui';
import { Attachment, PersonTravelVisa, PersonTravelVisas } from '../types';
import { TApi } from '../../../../data';
import { emptyInfo } from '../defaultData';
import css from '../DemoForm.module.scss';
import { IDir } from '../DemoForm';

export function VisasSection({ lens, dir }: { lens: ILens<PersonTravelVisas>, dir: IDir }) {
    const svc = useUuiContext<TApi, UuiContexts>();
    const visasLens = lens.prop('visas').default([emptyInfo.visa]);
    const scansLens = Lens.onEditable(lens.prop('scans').toProps()).default([]);
    
    const countriesDS = useAsyncDataSource<Country, string, unknown>(
        {
            api: () => svc.api.demo.countries({ sorting: [{ field: 'name' }] }).then((r) => r.items),
        },
        [],
    );
    function addVisa(item: PersonTravelVisa) {
        return visasLens.set(visasLens.get().concat(item));
    }
    function removeVisa(index: number) {
        const resultItems = visasLens.get().filter((_, i: number) => index !== i);
        return visasLens.set(resultItems);
    }

    function removeScan(index: number) {
        const resultItems = scansLens.get().filter((_, i: number) => index !== i);
        return scansLens.set(resultItems);
    }

    const updateAttachment = (newFile: Attachment, id: number) => {
        const scans = scansLens.default([]).get();

        scansLens.set(scans.map((i) => (i.id === id ? newFile : i)));
    };

    const trackFileProgress = (progress: number, id: number) => {
        const scans = scansLens.default([]).get();

        const file = scans.find((i) => i.id === id);
        file.progress = progress;
        updateAttachment(file, file.id);
    };
    
    const uploadFile = (files: File[]) => {
        if (files.length + scansLens.get().length <= 20 && files.every((i) => i.size <= 5000000)) {
            let tempIdCounter = 0;
            const attachments = scansLens.default([]).get();

            files.forEach((file) => {
                const tempId = --tempIdCounter;
                const fileToAttach = {
                    id: tempId,
                    name: file.name,
                    size: file.size,
                    progress: 0,
                };

                attachments.push(fileToAttach);
                svc.uuiApi.uploadFile('/upload/uploadFileMock', file, { onProgress: (progress) => trackFileProgress(progress, tempId) }).then((res) => {
                    updateAttachment({ ...res, progress: 100 }, tempId);
                });
            });

            scansLens.set(attachments);
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

    const renderVisaItem = (visa: PersonTravelVisa, index: number) => {
        const isClearable = index !== 0 || visa.country || visa.term;
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
                        <RangeDatePicker
                            id="term"
                            format="MMM D, YYYY"
                            rawProps={ { from: { dir: dir }, to: { dir: dir }, body: { dir: dir } } }
                            { ...visasLens.index(index).prop('term').toProps() }
                        />
                    </LabeledInput>
                </FlexCell>
                <FlexCell alignSelf="flex-end">
                    {isClearable && <IconButton icon={ ClearIcon } onClick={ () => removeVisa(index) } />}
                </FlexCell>
            </FlexRow>
        );
    };

    return (
        <>
            <RichTextView>
                <h3>Travel Visas</h3>
            </RichTextView>

            {visasLens.get().map(renderVisaItem)}

            <FlexRow vPadding="12">
                <Button onClick={ () => addVisa(emptyInfo.visa) } caption="Add One More" icon={ AddIcon } fill="none" />
            </FlexRow>

            <FlexRow vPadding="12" columnGap="18">
                <FlexCell width="100%">
                    <LabeledInput label="Scans">
                        <DropSpot infoText="Up to 20 files. Limit for 1 file is 5 MB" onUploadFiles={ (files) => uploadFile(files) } />
                        <div className={ scansLens.get().length && css.attachmentContainer }>
                            {scansLens.get().map((i, index) => (
                                <FileCard key={ index } file={ i } onClick={ () => removeScan(index) } />
                            ))}
                        </div>
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
        </>
    );
}
