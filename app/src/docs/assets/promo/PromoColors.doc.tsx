import * as React from 'react';
import * as css from './PromoColorsDoc.scss';
import { FlexCell, FlexRow, NotificationCard, RichTextView, Text, Tooltip } from '@epam/promo';
import { cx, arrayToMatrix, INotification } from '@epam/uui';
import { copyTextToClipboard } from '../../../helpers';
import { svc } from '../../../services';
import * as notificationIcon from '../../../icons/notification-check-fill-24.svg';

const basicColors = [
    { name: 'blue-lightest', hasVariable: true, hex: '#CEEFFF', context: '' },
    { name: 'blue-light', hasVariable: true, hex: '#B5E6FF', context: '' },
    { name: 'blue', hasVariable: true, hex: '#008ACE', context: '' },
    { name: 'blue-dark', hasVariable: true, hex: '#0079B5', context: '' },
    { name: 'blue-darkest', hasVariable: true, hex: '#00689B', context: '' },
    { name: 'green-lightest', hasVariable: true, hex: '#EEFFCC', context: '' },
    { name: 'green-light', hasVariable: true, hex: '#E5FFB3', context: '' },
    { name: 'green', hasVariable: true, hex: '#88CC00', context: '' },
    { name: 'green-dark', hasVariable: true, hex: '#77B300', context: '' },
    { name: 'green-darkest', hasVariable: true, hex: '#669900', context: '' },
    { name: 'amber-lightest', hasVariable: true, hex: '#FFF2CC', context: '' },
    { name: 'amber-light', hasVariable: true, hex: '#FFECB3', context: '' },
    { name: 'amber', hasVariable: true, hex: '#FFC000', context: '' },
    { name: 'amber-dark', hasVariable: true, hex: '#E6AD00', context: '' },
    { name: 'amber-darkest', hasVariable: true, hex: '#CC9A00', context: '' },
    { name: 'red-lightest', hasVariable: true, hex: '#FADED9', context: '' },
    { name: 'red-light', hasVariable: true, hex: '#F8CBC2', context: '' },
    { name: 'red', hasVariable: true, hex: '#E54322', context: '' },
    { name: 'red-dark', hasVariable: true, hex: '#D53919', context: '' },
    { name: 'red-darkest', hasVariable: true, hex: '#BE3316', context: '' },
];

const grayscaleColors = [
    { name: 'gray5', hasVariable: true, hex: '#FAFAFC', context: 'Table Header' },
    { name: 'gray10', hasVariable: true, hex: '#F5F6FA', context: 'Background' },
    { name: 'gray20', hasVariable: true, hex: '#EBEDF5', context: 'Table (Hover)' },
    { name: 'gray30', hasVariable: true, hex: '#E1E3EB', context: 'Table Divider, Button (Disabled), Input Border (Disabled), Cancel Button Border (Disabled), Informer, Tag' },
    { name: 'gray40', hasVariable: true, hex: '#CED0DB', context: 'Divider, Input Border' },
    { name: 'gray50', hasVariable: true, hex: '#ACAFBF', context: 'Disabled Text, Cancel Button Border' },
    { name: 'gray60', hasVariable: true, hex: '#6C6F80', context: 'Icon (Disabled), Input Border (Hover), Secondary Text, Placeholder' },
    { name: 'gray70', hasVariable: true, hex: '#474A59', context: 'Icon' },
    { name: 'gray80', hasVariable: true, hex: '#303240', context: 'Text, Icon (Hover), Primary Text' },
    { name: 'gray90', hasVariable: true, hex: '#1D1E26', context: 'Text' },
];

const additionalColors = [
    { name: 'red-lightest', hasVariable: false, hex: '#FADED9', context: '' },
    { name: 'red-light', hasVariable: false, hex: '#F5B7AB', context: '' },
    { name: 'red', hasVariable: true, hex: '#E54322', context: '' },
    { name: 'red-dark', hasVariable: false, hex: '#A72014', context: '' },
    { name: 'red-darkest', hasVariable: false, hex: '#901111', context: '' },
    { name: 'orange-lightest', hasVariable: false, hex: '#FAE4CF', context: '' },
    { name: 'orange-light', hasVariable: false, hex: '#F6CBA0', context: '' },
    { name: 'orange', hasVariable: true, hex: '#E67E17', context: '' },
    { name: 'orange-dark', hasVariable: false, hex: '#89370E', context: '' },
    { name: 'orange-darkest', hasVariable: false, hex: '#72250B', context: '' },
    { name: 'amber-lightest', hasVariable: false, hex: '#FFF2CC', context: '' },
    { name: 'amber-light', hasVariable: false, hex: '#FFE699', context: '' },
    { name: 'amber', hasVariable: true, hex: '#FFC000', context: '' },
    { name: 'amber-dark', hasVariable: false, hex: '#995A00', context: '' },
    { name: 'amber-darkest', hasVariable: false, hex: '#804000', context: '' },
    { name: 'green-lightest', hasVariable: false, hex: '#EEFFCC', context: '' },
    { name: 'green-light', hasVariable: false, hex: '#DDFF99', context: '' },
    { name: 'green', hasVariable: true, hex: '#88CC00', context: '' },
    { name: 'green-dark', hasVariable: false, hex: '#669900', context: '' },
    { name: 'green-darkest', hasVariable: false, hex: '#446600', context: '' },
    { name: 'cyan-lightest', hasVariable: false, hex: '#E3FCFC', context: '' },
    { name: 'cyan-light', hasVariable: false, hex: '#B4F8F8', context: '' },
    { name: 'cyan', hasVariable: true, hex: '#14CCCC', context: '' },
    { name: 'cyan-dark', hasVariable: false, hex: '#0F9E9E', context: '' },
    { name: 'cyan-darkest', hasVariable: false, hex: '#0B6F6F', context: '' },
    { name: 'blue-lightest', hasVariable: false, hex: '#CEEFFF', context: '' },
    { name: 'blue-light', hasVariable: false, hex: '#9BDEFF', context: '' },
    { name: 'blue', hasVariable: true, hex: '#008ACE', context: '' },
    { name: 'blue-dark', hasVariable: false, hex: '#00689B', context: '' },
    { name: 'blue-darkest', hasVariable: false, hex: '#004668', context: '' },
    { name: 'violet-lightest', hasVariable: false, hex: '#DBCCFA', context: '' },
    { name: 'violet-light', hasVariable: false, hex: '#BB9DF5', context: '' },
    { name: 'violet', hasVariable: true, hex: '#5214CC', context: '' },
    { name: 'violet-dark', hasVariable: false, hex: '#3F0F9E', context: '' },
    { name: 'violet-darkest', hasVariable: false, hex: '#2D0B6F', context: '' },
    { name: 'purple-lightest', hasVariable: false, hex: '#F2CCFA', context: '' },
    { name: 'purple-light', hasVariable: false, hex: '#E79DF5', context: '' },
    { name: 'purple', hasVariable: true, hex: '#AD14CC', context: '' },
    { name: 'purple-dark', hasVariable: false, hex: '#860F9E', context: '' },
    { name: 'purple-darkest', hasVariable: false, hex: '#5E0B6F', context: '' },
];

export class PromoColorsDoc extends React.Component {
    showNotification() {
        svc.uuiNotifications.show((props: INotification) =>
            <NotificationCard { ...props } icon={ notificationIcon } color='gray60' onClose={ null } >
                <Text size='36' font='sans'>HEX code was copied to the clipboard</Text>
            </NotificationCard>, { duration: 3 });
    }

    renderBasicColors() {
        let colorMatrix = arrayToMatrix(basicColors, 5);
        return (
            <RichTextView size='16' cx={ css.container } >
                <h2>Basics</h2>
                <FlexRow>
                    { colorMatrix.map((column, index) => {
                        return (
                            <FlexCell key={ index } minWidth={ 120 } >
                                { column.map((color, index) => {
                                    return (
                                        <Tooltip content={ color.context } key={ index } >
                                            <div className={ cx(css.box, css.basicColorBox, css[`basic-color-${color.name}`]) } >
                                                <div className={ css.hexText } onClick={ () => copyTextToClipboard(color.hex, this.showNotification) } >{ color.hex }</div>
                                                { color.hasVariable && <div className={ css.colorName } onClick={ () => {} } >{ `$${ color.name }` }</div> }
                                            </div>
                                        </Tooltip>
                                    );
                                }) }
                            </FlexCell>
                        );
                    })
                    }
                    <FlexCell minWidth={ 100 } alignSelf='flex-end' >
                        <div className={ cx(css.box, css.captionColorBox) }>
                            <Text color='gray60' font='sans-italic' fontSize='12' lineHeight='18' >Rested</Text>
                        </div>
                        <div className={ cx(css.box, css.captionColorBox) }>
                            <Text color='gray60' font='sans-italic' fontSize='12' lineHeight='18' >Hovered</Text>
                        </div>
                        <div className={ cx(css.box, css.captionColorBox) }>
                            <Text color='gray60' font='sans-italic' fontSize='12' lineHeight='18' >Pressed</Text>
                        </div>
                    </FlexCell>
                </FlexRow>
                <p>These colors are used for basic controls and semantic elements highlighting.</p>
            </RichTextView>
        );
    }

    renderGrayscaleColors() {
        return (
            <RichTextView size='16' cx={ css.container } >
                <h2>Grayscale</h2>
                <FlexRow>
                    { grayscaleColors.map((color) => {
                        return (
                            <Tooltip key={ color.name } content={ color.context } >
                                <div className={ cx(css.box, css.grayscaleColorBox, css[`grayscale-color-${color.name}`]) } >
                                    <div className={ css.hexText } onClick={ () => copyTextToClipboard(color.hex, this.showNotification) } >{ color.hex }</div>
                                    { color.hasVariable && <div className={ css.colorName } onClick={ () => {} } >{ `$${ color.name }` }</div> }
                                </div>
                            </Tooltip>
                        );
                    })
                    }
                </FlexRow>
                <p>These colors are used for borders, separators, icons, text and backgrounds. Each grayscale has its own specific purpose. Please do not change the purpose of the shades.</p>
            </RichTextView>
        );
    }

    renderAdditionalColors() {
        let colorMatrix = arrayToMatrix(additionalColors, 5);
        return (
            <RichTextView size='16' cx={ css.container } >
                <h2>Additional</h2>
                <FlexRow>
                    { colorMatrix.map((column, index) => {
                        return (
                            <FlexCell key={ index } minWidth={ 120 } >
                                { column.map((color, index) => {
                                    return (
                                        <Tooltip content={ color.context } key={ index } >
                                            <div className={ cx(css.box, css.additionalColorBox, css[`additional-color-${color.name}`]) } >
                                                <div className={ css.hexText } onClick={ () => copyTextToClipboard(color.hex, this.showNotification) } >{ color.hex }</div>
                                                { color.hasVariable && <div className={ css.colorName } onClick={ () => {} } >{ `$${ color.name }` }</div> }
                                            </div>
                                        </Tooltip>
                                    );
                                }) }
                            </FlexCell>
                        );
                    })
                    }
                </FlexRow>
                <p>These colors are used in all other cases: for illustrations, accents and so on.</p>
            </RichTextView>
        );
    }

    render() {
        return (
            <>
                { this.renderBasicColors() }
                { this.renderGrayscaleColors() }
                { this.renderAdditionalColors() }
            </>
        );
    }
}