import * as React from 'react';
import css from './PromoColorsDoc.module.scss';
import {
    FlexCell, FlexRow, NotificationCard, RichTextView, Text, Tooltip,
} from '@epam/uui';
import { cx, arrayToMatrix, INotification } from '@epam/uui-core';
import { copyTextToClipboard } from '../../../helpers';
import { svc } from '../../../services';
import { ReactComponent as NotificationIcon } from '../../../icons/notification-check-fill-24.svg';

const basicColors = [
    { name: 'blue-soft', hasVariable: true, hex: '#F5FDFF', context: '' },
    { name: 'blue-lightest', hasVariable: true, hex: '#D6F2FF', context: '' },
    { name: 'blue-light', hasVariable: true, hex: '#99DDFF', context: '' },
    { name: 'blue', hasVariable: true, hex: '#007BBD', context: '' },
    { name: 'blue-dark', hasVariable: true, hex: '#006AA3', context: '' },
    { name: 'blue-darkest', hasVariable: true, hex: '#005685', context: '' },
    { name: 'green-soft', hasVariable: true, hex: '#FCFFF5', context: '' },
    { name: 'green-lightest', hasVariable: true, hex: '#EEFFCC', context: '' },
    { name: 'green-light', hasVariable: true, hex: '#CFF486', context: '' },
    { name: 'green', hasVariable: true, hex: '#65A300', context: '' },
    { name: 'green-dark', hasVariable: true, hex: '#528500', context: '' },
    { name: 'green-darkest', hasVariable: true, hex: '#446600', context: '' },
    { name: 'amber-soft', hasVariable: true, hex: '#FFFCF5', context: '' },
    { name: 'amber-lightest', hasVariable: true, hex: '#FFF2CC', context: '' },
    { name: 'amber-light', hasVariable: true, hex: '#FFE38F', context: '' },
    { name: 'amber', hasVariable: true, hex: '#FFC000', context: '' },
    { name: 'amber-dark', hasVariable: true, hex: '#DB9D00', context: '' },
    { name: 'amber-darkest', hasVariable: true, hex: '#9F6B04', context: '' },
    { name: 'red-soft', hasVariable: true, hex: '#FEF7F6', context: '' },
    { name: 'red-lightest', hasVariable: true, hex: '#FADED9', context: '' },
    { name: 'red-light', hasVariable: true, hex: '#F5B5A8', context: '' },
    { name: 'red', hasVariable: true, hex: '#DB3A1A', context: '' },
    { name: 'red-dark', hasVariable: true, hex: '#C03316', context: '' },
    { name: 'red-darkest', hasVariable: true, hex: '#A02B13', context: '' },
];

const grayscaleColors = [
    {
        name: 'gray5', hasVariable: true, hex: '#FAFAFC', context: 'Table Header',
    }, {
        name: 'gray10', hasVariable: true, hex: '#F5F6FA', context: 'Background',
    }, {
        name: 'gray20', hasVariable: true, hex: '#EBEDF5', context: 'Table (Hover)',
    }, {
        name: 'gray30',
        hasVariable: true,
        hex: '#E1E3EB',
        context: 'Table Divider, Button (Disabled), Input Border (Disabled), Cancel Button Border (Disabled), Informer, Tag',
    }, {
        name: 'gray40', hasVariable: true, hex: '#CED0DB', context: 'Divider, Input Border',
    }, {
        name: 'gray50', hasVariable: true, hex: '#ACAFBF', context: 'Disabled Text, Cancel Button Border',
    }, {
        name: 'gray60', hasVariable: true, hex: '#6C6F80', context: 'Icon (Disabled), Input Border (Hover), Secondary Text, Placeholder',
    }, {
        name: 'gray70', hasVariable: true, hex: '#474A59', context: 'Icon',
    }, {
        name: 'gray80', hasVariable: true, hex: '#303240', context: 'Text, Icon (Hover), Primary Text',
    }, {
        name: 'gray90', hasVariable: true, hex: '#1D1E26', context: 'Text',
    },
];

const additionalColors = [
    { name: 'yellow-0', hasVariable: true, hex: '#FFFFF0', context: '' },
    { name: 'yellow-10', hasVariable: true, hex: '#FFFECC', context: '' },
    { name: 'yellow-20', hasVariable: true, hex: '#FFFCA4', context: '' },
    { name: 'yellow-30', hasVariable: true, hex: '#FDD63B', context: '' },
    { name: 'yellow-40', hasVariable: true, hex: '#F9B71D', context: '' },
    { name: 'yellow-50', hasVariable: true, hex: '#D3910C', context: '' },
    { name: 'orange-0', hasVariable: true, hex: '#FEF8F4', context: '' },
    { name: 'orange-10', hasVariable: true, hex: '#FFE8D7', context: '' },
    { name: 'orange-20', hasVariable: true, hex: '#FFCCA7', context: '' },
    { name: 'orange-30', hasVariable: true, hex: '#FF8B3E', context: '' },
    { name: 'orange-40', hasVariable: true, hex: '#F76B0D', context: '' },
    { name: 'orange-50', hasVariable: true, hex: '#BD4B00', context: '' },
    { name: 'fuchia-0', hasVariable: true, hex: '#FFF7FB', context: '' },
    { name: 'fuchia-10', hasVariable: true, hex: '#F9D8E7', context: '' },
    { name: 'fuchia-20', hasVariable: true, hex: '#EDADC8', context: '' },
    { name: 'fuchia-30', hasVariable: true, hex: '#EA4386', context: '' },
    { name: 'fuchia-40', hasVariable: true, hex: '#D61E68', context: '' },
    { name: 'fuchia-50', hasVariable: true, hex: '#AE1955', context: '' },
    { name: 'purple-0', hasVariable: true, hex: '#FDF6FE', context: '' },
    { name: 'purple-10', hasVariable: true, hex: '#F2CCFA', context: '' },
    { name: 'purple-20', hasVariable: true, hex: '#E79DF5', context: '' },
    { name: 'purple-30', hasVariable: true, hex: '#B114D1', context: '' },
    { name: 'purple-40', hasVariable: true, hex: '#860F9E', context: '' },
    { name: 'purple-50', hasVariable: true, hex: '#5E0B6F', context: '' },
    { name: 'violet-0', hasVariable: true, hex: '#F8F6FE', context: '' },
    { name: 'violet-10', hasVariable: true, hex: '#DBCCFA', context: '' },
    { name: 'violet-20', hasVariable: true, hex: '#BB9DF5', context: '' },
    { name: 'violet-30', hasVariable: true, hex: '#773CEC', context: '' },
    { name: 'violet-40', hasVariable: true, hex: '#5514D6', context: '' },
    { name: 'violet-50', hasVariable: true, hex: '#40109E', context: '' },
    { name: 'cobalt-0', hasVariable: true, hex: '#F8FAFF', context: '' },
    { name: 'cobalt-10', hasVariable: true, hex: '#D9E2FC', context: '' },
    { name: 'cobalt-20', hasVariable: true, hex: '#AEC0F5', context: '' },
    { name: 'cobalt-30', hasVariable: true, hex: '#0F98FF', context: '' },
    { name: 'cobalt-40', hasVariable: true, hex: '#006FE5', context: '' },
    { name: 'cobalt-50', hasVariable: true, hex: '#0954A5', context: '' },
    { name: 'cyan-0', hasVariable: true, hex: '#F5FBFF', context: '' },
    { name: 'cyan-10', hasVariable: true, hex: '#D1FAFA', context: '' },
    { name: 'cyan-20', hasVariable: true, hex: '#AAEEEE', context: '' },
    { name: 'cyan-30', hasVariable: true, hex: '#14CCCC', context: '' },
    { name: 'cyan-40', hasVariable: true, hex: '#0F9E9E', context: '' },
    { name: 'cyan-50', hasVariable: true, hex: '#0B6F6F', context: '' },
    { name: 'mint-0', hasVariable: true, hex: '#F2FCF5', context: '' },
    { name: 'mint-10', hasVariable: true, hex: '#DDF3E4', context: '' },
    { name: 'mint-20', hasVariable: true, hex: '#B4DFC4', context: '' },
    { name: 'mint-30', hasVariable: true, hex: '#4FC48C', context: '' },
    { name: 'mint-40', hasVariable: true, hex: '#2E9E68', context: '' },
    { name: 'mint-50', hasVariable: true, hex: '#236E4A', context: '' },
];

export class PromoColorsDoc extends React.Component {
    showNotification() {
        svc.uuiNotifications.show(
            (props: INotification) => (
                <NotificationCard { ...props } icon={ NotificationIcon } color="info" onClose={ null }>
                    <Text size="36">
                        HEX code was copied to the clipboard
                    </Text>
                </NotificationCard>
            ),
            { duration: 3 },
        );
    }

    renderBasicColors() {
        const colorMatrix = arrayToMatrix(basicColors, 6);
        return (
            <RichTextView size="16" cx={ css.container }>
                <h2>Basics</h2>
                <FlexRow>
                    {colorMatrix.map((column, i) => {
                        return (
                            <FlexCell key={ i } minWidth={ 120 }>
                                {column.map((color, index) => {
                                    return (
                                        <Tooltip content={ color.context } key={ index }>
                                            <div className={ cx(css.box, css.basicColorBox, css[`basic-color-${color.name}`]) }>
                                                <button className={ css.hexText } onClick={ () => copyTextToClipboard(color.hex, this.showNotification) }>
                                                    {color.hex}
                                                </button>
                                                {color.hasVariable && <div className={ css.colorName }>{`$${color.name}`}</div>}
                                            </div>
                                        </Tooltip>
                                    );
                                })}
                            </FlexCell>
                        );
                    })}
                    <FlexCell minWidth={ 100 } alignSelf="flex-end">
                        <div className={ cx(css.box, css.captionColorBox) }>
                            <Text color="secondary" fontStyle="italic" fontSize="12" lineHeight="18">
                                Rested
                            </Text>
                        </div>
                        <div className={ cx(css.box, css.captionColorBox) }>
                            <Text color="secondary" fontStyle="italic" fontSize="12" lineHeight="18">
                                Hovered
                            </Text>
                        </div>
                        <div className={ cx(css.box, css.captionColorBox) }>
                            <Text color="secondary" fontStyle="italic" fontSize="12" lineHeight="18">
                                Pressed
                            </Text>
                        </div>
                    </FlexCell>
                </FlexRow>
                <p>These colors are used for basic controls and semantic elements highlighting.</p>
            </RichTextView>
        );
    }

    renderGrayscaleColors() {
        return (
            <RichTextView size="16" cx={ css.container }>
                <h2>Grayscale</h2>
                <FlexRow>
                    {grayscaleColors.map((color) => {
                        return (
                            <Tooltip key={ color.name } content={ color.context }>
                                <div className={ cx(css.box, css.grayscaleColorBox, css[`grayscale-color-${color.name}`]) }>
                                    <button className={ css.hexText } onClick={ () => copyTextToClipboard(color.hex, this.showNotification) }>
                                        {color.hex}
                                    </button>
                                    {color.hasVariable && <div className={ css.colorName }>{`$${color.name}`}</div>}
                                </div>
                            </Tooltip>
                        );
                    })}
                </FlexRow>
                <p>
                    These colors are used for borders, separators, icons, text, and backgrounds. Each grayscale has its specific purpose. Please do not change the purpose
                    of the shades.
                </p>
            </RichTextView>
        );
    }

    renderAdditionalColors() {
        const colorMatrix = arrayToMatrix(additionalColors, 6);
        return (
            <RichTextView size="16" cx={ css.container }>
                <h2>Additional</h2>
                <FlexRow>
                    {colorMatrix.map((column, index) => {
                        return (
                            <FlexCell key={ index } minWidth={ 120 }>
                                {column.map((color, idx) => {
                                    return (
                                        <Tooltip content={ color.context } key={ idx }>
                                            <div className={ cx(css.box, css.additionalColorBox, css[`additional-color-${color.name}`]) }>
                                                <button className={ css.hexText } onClick={ () => copyTextToClipboard(color.hex, this.showNotification) }>
                                                    {color.hex}
                                                </button>
                                                {color.hasVariable && <div className={ css.colorName }>{`$${color.name}`}</div>}
                                            </div>
                                        </Tooltip>
                                    );
                                })}
                            </FlexCell>
                        );
                    })}
                </FlexRow>
                <p>These colors are used in all other cases: for illustrations, accents and so on.</p>
            </RichTextView>
        );
    }

    render() {
        return (
            <>
                {this.renderBasicColors()}
                {this.renderGrayscaleColors()}
                {this.renderAdditionalColors()}
            </>
        );
    }
}
