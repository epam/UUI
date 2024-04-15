import React from 'react';
import { IModal } from '@epam/uui-core';
import { demoData } from '@epam/uui-docs';
import {
  ModalBlocker,
  ModalFooter,
  ModalHeader,
  ModalWindow,
  FlexRow,
  FlexSpacer,
  Panel,
  ScrollBars,
  Text,
  Button,
} from '@epam/promo';

export const BasicModalExample = (modalProps: IModal<string | boolean>) => {
  return (
    <ModalBlocker {...modalProps}>
      <ModalWindow>
        <Panel background='white'>
          <ModalHeader
            title='Simple modal example '
            onClose={() => modalProps.abort()}
          />
          <ScrollBars
            hasTopShadow
            hasBottomShadow
          >
            <FlexRow padding='24'>
              <Text size='36'> {demoData.loremIpsum.repeat(3)} </Text>
            </FlexRow>
          </ScrollBars>
          <ModalFooter>
            <FlexSpacer />
            <Button
              color='gray50'
              fill='white'
              caption='Cancel'
              onClick={() => modalProps.abort()}
            />
            <Button
              color='blue'
              caption='Ok'
              onClick={() => modalProps.success('Success action')}
            />
          </ModalFooter>
        </Panel>
      </ModalWindow>
    </ModalBlocker>
  );
};
