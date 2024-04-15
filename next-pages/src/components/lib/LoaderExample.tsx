import {
  FlexRow,
  Panel,
  Spinner,
  Button,
  FlexSpacer,
  ProgressBar,
  Blocker,
  FlexCell,
  LabeledInput,
  TextInput,
  NumericInput,
  DatePicker,
} from '@epam/promo';
import styles from '../../styles/Home.module.scss';
import React from 'react';

export function LoaderExample() {
  const renderForm = () => {
    return (
      <FlexCell minWidth={520}>
        <FlexRow
          spacing='12'
          padding='24'
          vPadding='24'
        >
          <LabeledInput label='Name'>
            <TextInput
              value='Alex'
              onValueChange={() => null}
            />
          </LabeledInput>
          <LabeledInput label='Country'>
            <TextInput
              value='Belarus'
              onValueChange={() => null}
            />
          </LabeledInput>
        </FlexRow>
        <FlexRow
          spacing='12'
          padding='24'
          vPadding='24'
        >
          <LabeledInput label='Age'>
            <NumericInput
              max={100}
              min={0}
              value={20}
              onValueChange={() => null}
            />
          </LabeledInput>
          <LabeledInput label='Country'>
            <DatePicker
              format='DD/MM/YYYY'
              value='2042-11-20'
              onValueChange={() => null}
            />
          </LabeledInput>
        </FlexRow>
        <FlexRow
          spacing='12'
          padding='24'
          vPadding='24'
        >
          <FlexSpacer />
          <Button
            color='blue'
            caption='Submit'
          />
          <Button
            color='green'
            fill='none'
            caption='Cancel'
          />
        </FlexRow>
      </FlexCell>
    );
  };

  return (
    <Panel
      cx='withGap'
      rawProps={{
        style: { borderRadius: 0 },
      }}
    >
      <FlexRow>
        <ProgressBar
          progress={45}
          cx={styles.progressBar}
        />
      </FlexRow>
      <FlexRow>
        <div style={{ position: 'relative' }}>
          {renderForm()}
          <Blocker isEnabled={true} />
        </div>
      </FlexRow>
      <FlexRow>
        <Spinner cx={styles.spinner} />
      </FlexRow>
    </Panel>
  );
}
