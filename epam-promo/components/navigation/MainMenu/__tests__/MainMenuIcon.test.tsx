import React from 'react';
import renderer from 'react-test-renderer';
import { MainMenuIcon } from '../MainMenuIcon';
import * as calendarIcon from '../../../../icons/calendar-18.svg';

describe('MainMenuIcon', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<MainMenuIcon icon={ calendarIcon } />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<MainMenuIcon
                icon={ calendarIcon }
                target='_blank'
                link={ { pathname: '/' } }
                collapseToMore
                estimatedWidth={ 120 }
                priority={ 6 }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


