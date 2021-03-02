import React from 'react';
import { ModalBlocker, ModalHeader, ModalFooter, ModalWindow } from '../Modals';
import renderer from 'react-test-renderer';

describe('Modals', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<ModalBlocker key='blocker' isActive zIndex={ 1 } abort={ jest.fn } success={ jest.fn } >
                <ModalWindow>
                    <ModalHeader />
                    <ModalFooter />
                </ModalWindow>
            </ModalBlocker>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<ModalBlocker
                    key='blocker'
                    isActive
                    zIndex={ 1 }
                    abort={ jest.fn }
                    success={ jest.fn }
                    blockerShadow='dark'
                    disallowClickOutside
                >
                <ModalWindow
                    height='300'
                    width='300'
                    onClick={ jest.fn }
                >
                    <ModalHeader
                        title='Test header'
                        onClose={ jest.fn }
                        borderBottom
                        margin='12'
                        background='gray5'
                        size='36'
                        spacing='6'
                        padding='6'
                        topShadow
                        vPadding='12'
                    />
                    <ModalFooter
                        borderBottom
                        margin='12'
                        background='white'
                        size='48'
                        spacing='12'
                        padding='18'
                        topShadow
                        vPadding='24'
                    />
                </ModalWindow>
            </ModalBlocker>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


