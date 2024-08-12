import type { Settings } from './settings.types';

export const settings: Settings = {
    sizes: {
        defaults: {
            badge: '36',
            button: '36',
            checkbox: '18',
            countIndicator: '24',
            dataPickerCell: '36',
            linkButton: '36',
            numericInput: '36',
            pickerToggler: '36',
            pickerItem: '36',
            radioInput: '18',
            switch: '18',
            tabButton: '48',
            tag: '36',
            text: '36',
            textArea: '36',
            textInput: '36',
            rangeDatePicker: '36',
            datePicker: '36',
            labeledInput: '36',
            statusIndicator: '24',
        },
        tag: {
            countIndicator: {
                18: '12',
                24: '18',
                30: '18',
                36: '18',
                42: '24',
                48: '24',
            },
        },
        mobileDropdownWrapper: {
            linkButton: '48',
        },
        pickerInput: {
            height: 300,
            width: 360,
            rowSize: {
                mobile: '48',
                modal: '36',
                padding: {
                    modal: '24',
                    default: '12',
                },
            },
        },
        pickerToggler: {
            tag: {
                24: '18',
                30: '18',
                36: '24',
                42: '30',
                48: '36',
                60: '42',
            },
        },
        dataPickerHeader: {
            text: {
                fontWeight: '600',
                size: '48',
            },
        },
        dataPickerBody: {
            flexCell: {
                default: '36',
            },
            searchInput: {
                mobile: '48',
            },
        },
        pickerItem: { // max 48, setup by row with 60????
            avatar: {
                rest: {
                    24: '18',
                    30: '24',
                    36: '30',
                    42: '36',
                    48: '36', // no design
                },
                multiline: {
                    24: '30',
                    30: '30',
                    36: '36',
                    42: '42',
                    48: '48', // no design
                },
            },
        },
        dataPickerCell: {
            isBoldIcon: {
                24: true,
            },
            padding: {
                default: '12',
            },
            paddingLeft: {
                default: '24',
            },
            text: {
                24: '24',
                30: '30',
                36: '36',
                42: '42',
                48: '48',
                60: '48',
            },
            icon: {
                24: '12',
                30: '18',
                36: '18',
                42: '24',
                48: '24',
                60: '24',
            },
        },
        dataPickerRow: { // max 60
            padding: {
                default: '24',
            },
            dataPickerCell: {
                default: '36',
            },
        },
        dataPickerFooter: {
            flexRowPadding: '12',
            switch: {
                24: '12',
                30: '18',
                36: '36',
                42: '24',
                48: '24',
            },
            linkButton: {
                24: '24',
                30: '30',
                36: '36',
                42: '42',
                48: '48',
                mobile: '48',
            },
        },
        rowAddons: {
            checkbox: {
                24: '12',
                30: '18',
                36: '18',
                42: '18',
                48: '18',
                60: '18',
            },
            icon: {
                24: '12',
                30: '18',
                36: '18',
                42: '24',
                48: '24',
                60: '24',
            },
            indentUnit: {
                24: 6,
                30: 12,
                36: 12,
                42: 24,
                48: 24,
                60: 24,
                default: 24,
            },
            indentWidth: {
                24: 12,
                30: 18,
                36: 18,
                42: 24,
                48: 24,
                60: 24,
                default: 12,
            },
        },
        text: {
            18: { lineHeight: 12, fontSize: 10 },
            24: { lineHeight: 18, fontSize: 12 },
            30: { lineHeight: 18, fontSize: 14 },
            36: { lineHeight: 18, fontSize: 14 },
            42: { lineHeight: 24, fontSize: 16 },
            48: { lineHeight: 24, fontSize: 16 },
            60: { lineHeight: 30, fontSize: 24 },
        },
        filterPickerBody: {
            pickerItem: '36',
            dataPickerRow: '36',
            dataPickerFooter: '36',
            searchSize: '36',
        },
        labeledInput: {
            fillIcon: ['24', '30'],
        },
        badge: {
            countIndicator: {
                18: '12',
                24: '18',
                30: '18',
                36: '18',
                42: '24',
                48: '24',
            },
        },
    },
};
