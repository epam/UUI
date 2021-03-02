import * as React from 'react';
import { LinkButton } from '@epam/promo';
import * as myIcon from '@epam/assets/icons/common/action-eye-18.svg';


export function BasicLinkButtonExample() {
    return (
      <div>
          <LinkButton caption='Link text' link={ { pathname: '/' } } size='48'  />
          <LinkButton caption='Link text' link={ { pathname: '/' } } size='42' icon={ myIcon } iconPosition='right' />
          <LinkButton caption='Link text' link={ { pathname: '/' } } size='36' icon={ myIcon } />
          <LinkButton caption='Link text' size='30' onClick={ () => {/*redirect implementation*/} } />
          <LinkButton caption='Link text' size='24' href='https://www.epam.com/' />
      </div>
    );
}