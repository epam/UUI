import * as React from 'react';
import { Lens, IEditable, ArrayDataSource } from '@epam/uui';
import { LabeledInput, TextInput, FlexRow, FlexCell, Button, FlexSpacer, PickerInput, LinkButton, RichTextView } from '@epam/loveship';
import { PersonExperienceItem } from '@epam/uui-docs';
import * as addIcon from '@epam/assets/icons/common/content-plus-18.svg';
import * as removeIcon from '@epam/assets/icons/common/navigation-close-24.svg';

export interface ExperienceEditorProps extends IEditable<PersonExperienceItem[]> {
    isDisabled?: boolean;
    isReadOnly?: boolean;
}

let years = (new Array(50)).fill(0).map((item, index) => (2018 - index).toString()).map(name => ({ id: name, name: name }));

export class ExperienceEditor extends React.Component<ExperienceEditorProps> {
    lens = Lens.onEditableComponent<PersonExperienceItem[]>(this).default([]);

    yearsDataSource = new ArrayDataSource<{ name: string }, string>({
        items: years,
    });

    renderYearPicker(label: string, editable: IEditable<string>) {
        return (
            <LabeledInput { ...editable }>
                <PickerInput<{ name: string }, string>
                    { ...editable }
                    dataSource={ this.yearsDataSource }
                    selectionMode='single'
                    valueType='id'
                    getName={ (val) => val.name }
                    size='36'
                />
            </LabeledInput>
        );
    }

    renderItem(item: PersonExperienceItem, index: number) {
        let lens = this.lens.index(index);
        return <FlexRow type='form' key={ `experienceName${index}` }>
            <FlexCell grow={ 1 }>
                <LabeledInput { ...lens.prop('experienceName').toProps() }>
                    <TextInput
                        { ...lens.prop('experienceName').toProps() }
                    />
                </LabeledInput>
            </FlexCell>
            <FlexCell grow={ 1 }>
                { this.renderYearPicker('Work Start', lens.prop('startRange').toProps()) }
            </FlexCell>
            <FlexCell grow={ 1 }>
                { this.renderYearPicker('Work End', lens.prop('endRange').toProps()) }
            </FlexCell>
            <FlexCell width='auto'>
                <LinkButton
                    icon={ removeIcon }
                    color='night600'
                    onClick={ () => this.props.onValueChange(this.props.value.filter((item, i) => index != i)) }
                />
            </FlexCell>
        </FlexRow>;
    }

    render() {
        const value = this.lens.get();
        return <>
            <FlexRow padding='24'>
                <FlexCell grow={ 1 }>
                    <RichTextView><b>Experience</b></RichTextView>
                </FlexCell>
                <FlexCell grow={ 1 }>
                    <RichTextView><b>Work Start</b></RichTextView>
                </FlexCell>
                <FlexCell grow={ 1 }>
                    <RichTextView><b>Work End</b></RichTextView>
                </FlexCell>
            </FlexRow>
            { value.map((item, index) => this.renderItem(item, index)) }
            { (value.length == 0)
                && <FlexRow padding='24'>
                    <RichTextView>No Experience defined</RichTextView>
                </FlexRow>
            }
            <FlexRow type='form'>
                <Button
                    onClick={ () => this.props.onValueChange([...value, { experienceName: '', rangeDateValue: { from: '', to: '' } }]) }
                    caption='add'
                    size='30'
                    color='grass'
                    icon={ addIcon }
                />
                <FlexSpacer />
            </FlexRow>
        </>;
    }
}