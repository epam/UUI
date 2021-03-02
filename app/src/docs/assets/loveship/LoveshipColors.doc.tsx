import * as React from 'react';
import { FlexCell, FlexRow, NotificationCard, RichTextView, Text, Tooltip } from '@epam/promo';
import { cx, INotification } from '@epam/uui';
import { copyTextToClipboard } from './../../../helpers';
import { svc } from './../../../services';
import * as notificationIcon from './../../../icons/notification-check-fill-24.svg';
import * as style from '@epam/loveship/assets/styles/scss/loveship-color-vars.scss';
import * as css from './LoveshipColorsDoc.scss';

type BasicColorsTypes = 'sun' | 'grass' | 'fire' | 'sky';
type AdditionalColorsTypes = 'red' | 'pink' | 'purple' | 'indigo' | 'blue' | 'cyan' | 'teal' | 'green' | 'lime' | 'yellow' | 'amber' | 'orange';

const basicColors = {
    'sky': [
        { hasVariable: false, hex: '#E1F4FA', contrastText: false },
        { hasVariable: false, hex: '#C4EAF5', contrastText: false },
        { hasVariable: true, hex: '#009ECC', contrastText: true },
        { hasVariable: false, hex: '#008ABD', contrastText: true },
        { hasVariable: false, hex: '#0079AD', contrastText: true },
    ],
    'grass': [
        { hasVariable: false, hex: '#EBF3D8', contrastText: false },
        { hasVariable: false, hex: '#D6E6B2', contrastText: false },
        { hasVariable: true, hex: '#67A300', contrastText: true },
        { hasVariable: false, hex: '#558A00', contrastText: true },
        { hasVariable: false, hex: '#428024', contrastText: true },
    ],
    'sun': [
        { hasVariable: false, hex: '#FFEDC9', contrastText: false },
        { hasVariable: false, hex: '#FFDD96', contrastText: false },
        { hasVariable: true, hex: '#FCAA00', contrastText: false },
        { hasVariable: false, hex: '#F67E00', contrastText: true },
        { hasVariable: false, hex: '#E64C00', contrastText: true },
    ],
    'fire': [
        { hasVariable: false, hex: '#FDE1E1', contrastText: false },
        { hasVariable: false, hex: '#FCC8C8', contrastText: false },
        { hasVariable: true, hex: '#FA4B4B', contrastText: true },
        { hasVariable: false, hex: '#CC2929', contrastText: true },
        { hasVariable: false, hex: '#B32424', contrastText: true },
    ],
};

const grayscaleColors = [
    { name: 'night50', hasVariable: true, hex: '#FAFAFC', context: 'Table Header' },
    { name: 'night100', hasVariable: true, hex: '#F5F6FA', context: 'Background' },
    { name: 'night200', hasVariable: true, hex: '#EBEDF5', context: 'Table (Hover)' },
    { name: 'night300', hasVariable: true, hex: '#E1E3EB', context: 'Table Divider, Button (Disabled), Input Border (Disabled), Cancel Button Border (Disabled), Informer, Tag' },
    { name: 'night400', hasVariable: true, hex: '#CED0DB', context: 'Divider, Input Border' },
    { name: 'night500', hasVariable: true, hex: '#ACAFBF', context: 'Disabled Text, Cancel Button Border' },
    { name: 'night600', hasVariable: true, hex: '#6C6F80', context: 'Icon (Disabled), Input Border (Hover), Secondary Text, Placeholder' },
    { name: 'night700', hasVariable: true, hex: '#474A59', context: 'Icon' },
    { name: 'night800', hasVariable: true, hex: '#303240', context: 'Text, Icon (Hover), Primary Text' },
    { name: 'night900', hasVariable: true, hex: '#1D1E26', context: 'Text' },
];

const additionalColors: any = {
    'red': [
        { hex: '#FFEADB', contrastText: false },
        { hex: '#FFD7BE', contrastText: false },
        { hex: '#FFC09E', contrastText: false },
        { hex: '#FFA47F', contrastText: false },
        { hex: '#FF8561', contrastText: false },
        { hex: '#FC6449', contrastText: true },
        { hex: '#F44336', contrastText: true },
        { hex: '#E02C24', contrastText: true },
        { hex: '#C01A17', contrastText: true },
        { hex: '#8C0E0E', contrastText: true },
    ],
    'orange': [
        { hex: '#FFECD9', contrastText: false },
        { hex: '#FFE1BD', contrastText: false },
        { hex: '#FFD091', contrastText: false },
        { hex: '#FFB851', contrastText: false },
        { hex: '#FF9800', contrastText: false },
        { hex: '#FB8200', contrastText: false },
        { hex: '#F46900', contrastText: true },
        { hex: '#E44E00', contrastText: true },
        { hex: '#C63100', contrastText: true },
        { hex: '#991900', contrastText: true },
    ],
    'amber': [
        { hex: '#FFF7E6', contrastText: false },
        { hex: '#FFE7B9', contrastText: false },
        { hex: '#FFD88E', contrastText: false },
        { hex: '#FECB69', contrastText: false },
        { hex: '#FDBE4C', contrastText: false },
        { hex: '#FBB035', contrastText: false },
        { hex: '#F6A024', contrastText: false },
        { hex: '#EA8C18', contrastText: true },
        { hex: '#D47110', contrastText: true },
        { hex: '#B3530B', contrastText: true },
    ],
    'yellow': [
        { hex: '#FFFFF2', contrastText: false },
        { hex: '#FFFECC', contrastText: false },
        { hex: '#FFFCA4', contrastText: false },
        { hex: '#FFF57D', contrastText: false },
        { hex: '#FEE759', contrastText: false },
        { hex: '#FDD63B', contrastText: false },
        { hex: '#FCC425', contrastText: false },
        { hex: '#FAB516', contrastText: false },
        { hex: '#F5AA0E', contrastText: true },
        { hex: '#E39B0B', contrastText: true },
    ],
    'lime': [
        { hex: '#F7FFCC', contrastText: false },
        { hex: '#F0FCA8', contrastText: false },
        { hex: '#E8F681', contrastText: false },
        { hex: '#DDEC5B', contrastText: false },
        { hex: '#CDDC39', contrastText: false },
        { hex: '#B3C91F', contrastText: true },
        { hex: '#97B20E', contrastText: true },
        { hex: '#7B9905', contrastText: true },
        { hex: '#627F01', contrastText: true },
        { hex: '#4D6600', contrastText: true },
    ],
    'green': [
        { hex: '#E8FFE6', contrastText: false },
        { hex: '#C7FDC2', contrastText: false },
        { hex: '#A8F9A0', contrastText: false },
        { hex: '#8EF384', contrastText: false },
        { hex: '#78EA70', contrastText: false },
        { hex: '#67DE61', contrastText: true },
        { hex: '#57CB56', contrastText: true },
        { hex: '#4CAF50', contrastText: true },
        { hex: '#1E8F2F', contrastText: true },
        { hex: '#00661A', contrastText: true },
    ],
    'teal': [
        { hex: '#E7FCF7', contrastText: false },
        { hex: '#B9FBEC', contrastText: false },
        { hex: '#8CF8E0', contrastText: false },
        { hex: '#64F4D5', contrastText: false },
        { hex: '#43ECCB', contrastText: false },
        { hex: '#2AE2C1', contrastText: true },
        { hex: '#16D1B5', contrastText: true },
        { hex: '#09B9A3', contrastText: true },
        { hex: '#009688', contrastText: true },
        { hex: '#11736E', contrastText: true },
    ],
    'cyan': [
        { hex: '#EBFFFD', contrastText: false },
        { hex: '#C2FCF8', contrastText: false },
        { hex: '#9BF7F1', contrastText: false },
        { hex: '#78EFEA', contrastText: false },
        { hex: '#5CE2E3', contrastText: false },
        { hex: '#46C8D3', contrastText: true },
        { hex: '#35ADBF', contrastText: true },
        { hex: '#2791A4', contrastText: true },
        { hex: '#1D7586', contrastText: true },
        { hex: '#145866', contrastText: true },
    ],
    'blue': [
        { hex: '#F3FDFF', contrastText: false },
        { hex: '#DCFAFF', contrastText: false },
        { hex: '#C5F6FF', contrastText: false },
        { hex: '#95EAFF', contrastText: false },
        { hex: '#4BC9FF', contrastText: false },
        { hex: '#32B2FB', contrastText: true },
        { hex: '#2196F3', contrastText: true },
        { hex: '#0E74E2', contrastText: true },
        { hex: '#0453C7', contrastText: true },
        { hex: '#003399', contrastText: true },
    ],
    'indigo': [
        { hex: '#F4E6FF', contrastText: false },
        { hex: '#F1DEFF', contrastText: false },
        { hex: '#E4CFFF', contrastText: false },
        { hex: '#CAB5FC', contrastText: false },
        { hex: '#9D8FE9', contrastText: false },
        { hex: '#6362C9', contrastText: true },
        { hex: '#3F51B5', contrastText: true },
        { hex: '#2E3A9D', contrastText: true },
        { hex: '#21288D', contrastText: true },
        { hex: '#191980', contrastText: true },
    ],
    'purple': [
        { hex: '#FFDEF6', contrastText: false },
        { hex: '#FBDAF3', contrastText: false },
        { hex: '#F4C7EA', contrastText: false },
        { hex: '#E9A4DF', contrastText: false },
        { hex: '#DA76D5', contrastText: false },
        { hex: '#C047C7', contrastText: true },
        { hex: '#9C27B0', contrastText: true },
        { hex: '#8018A0', contrastText: true },
        { hex: '#680B8F', contrastText: true },
        { hex: '#550080', contrastText: true },
    ],
    'pink': [
        { hex: '#FFDEDE', contrastText: false },
        { hex: '#FFD7D9', contrastText: false },
        { hex: '#FFC6CA', contrastText: false },
        { hex: '#FFA9B3', contrastText: false },
        { hex: '#FD8197', contrastText: false },
        { hex: '#F5527B', contrastText: true },
        { hex: '#E91E63', contrastText: true },
        { hex: '#CD0053', contrastText: true },
        { hex: '#B00052', contrastText: true },
        { hex: '#94004C', contrastText: true },
    ],
};

export class LoveshipColorsDoc extends React.Component {
    showNotification() {
        svc.uuiNotifications.show((props: INotification) =>
            <NotificationCard { ...props } icon={ notificationIcon } color='gray60' onClose={ null } >
                <Text size='36' font='sans'>HEX code was copied to the clipboard</Text>
            </NotificationCard>, { duration: 3 });
    }

    renderBasicColors() {
        return (
            <RichTextView size='16' cx={ css.container } >
                <h2>Basics</h2>
                <FlexRow>
                    { (Object.keys(basicColors) as Array<BasicColorsTypes>).map((nameColor, index) => {
                        return (
                            <FlexCell key={ index } minWidth={ 120 } >
                                { basicColors[nameColor].map((color, index) => {
                                    return (
                                        <div key={ index } className={ cx(css.box, css.basicColorBox, style[`color-${ nameColor }`]) } >
                                            <div className={ cx(css.hexText, color.contrastText && css.contrastText) } onClick={ () => copyTextToClipboard(color.hex, this.showNotification) } >{ color.hex }</div>
                                            { color.hasVariable && <div className={ cx(css.colorName, color.contrastText && css.contrastText) } onClick={ () => {} } >{ `$${ nameColor }` }</div> }
                                        </div>
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
                            <Tooltip key={ color.name } content={ false && color.context } >
                                <div className={ cx(css.box, css.grayscaleColorBox, style[`color-${ color.name }`]) } >
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
        return (
            <RichTextView size='16' cx={ css.container } >
                <h2>Additional</h2>
                <FlexRow>
                    { (Object.keys(additionalColors) as Array<AdditionalColorsTypes>).map((nameColor: AdditionalColorsTypes, index: number) => {
                        return (
                            <FlexCell key={ index } minWidth={ 80 } >
                                { additionalColors[nameColor].map((color: any, index: number) => {
                                    return (
                                        <div key={ index } className={ cx(css.box, css.additionalColorBox) } style={ { 'backgroundColor': color.hex } } >
                                            <div className={ cx(css.hexText, color.contrastText && css.contrastText) } onClick={ () => copyTextToClipboard(color.hex, this.showNotification) } >{ color.hex }</div>
                                        </div>
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