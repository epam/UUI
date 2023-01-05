import React from 'react';
import { FlexCell, FlexRow, IconContainer, Text, Tooltip } from '@epam/promo';
import { ReactComponent as myIcon } from '@epam/assets/icons/common/action-target-18.svg';
import css from './WithIconExample.scss';

export default function IconTooltipExample() {
    const renderIconMarkup = () => (
     <FlexRow spacing='6' alignItems='top' cx={ css.container }>
        <IconContainer icon={ myIcon } color='blue' style={ {marginTop: '3px', justifyContent: 'start'} } />
        <FlexCell width='auto' >
          <Text cx={ css.header } fontSize='14' lineHeight='18' font='sans-semibold'>Auto-update</Text>
          <Text cx={ css.content } fontSize='12' lineHeight='18'>Preselected during request-to-propose Jun 21, 2022 10:32</Text>
        </FlexCell>
      </FlexRow>);

    return (
      <FlexRow alignItems='center'>
        <Tooltip content={ renderIconMarkup() } color='white' >
            <Text fontSize='14' cx={ css.text }>Jun 21, 2022 09:16 </Text>
        </Tooltip>
      </FlexRow>
    );
}