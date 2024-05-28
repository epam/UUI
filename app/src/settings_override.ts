export const settings_override = {
    sizes: {
        defaults: {
            button: '40',
            checkbox: '20',
            countIndicator: '24',
            dataPickerCell: '40',
            linkButton: '40',
            numericInput: '40',
            pickerToggler: '40',
            pickerItem: '40',
            radioInput: '18',
            switch: '18',
            tabButton: '40',
            tag: '36',
            text: '40',
            textInput: '40',
            rangeDatePicker: '40',
            datePicker: '40',
        },
        tag: {
            countIndicator: {

                40: '24',
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
                30: '24',
                36: '30',
                40: '36',
                48: '40',
                60: '48',
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
                    40: '36',
                    48: '36', // no design
                },
                multiline: {
                    24: '30',
                    30: '30',
                    36: '36',
                    40: '40',
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
                40: '40',
                48: '48',
                60: '48',
            },
        },
        dataPickerRow: { // max 60
            padding: {
                default: '24',
            },
            dataPickerCell: {
                default: '40',
            },
        },
        dataPickerFooter: {
            flexRowPadding: '12',
            switch: {
                24: '12',
                30: '18',
                36: '18',
                40: '24',
                48: '24',
            },
            linkButton: {
                24: '12',
                30: '18',
                36: '18',
                40: '24',
                48: '24',
                mobile: '48',
            },
        },
        rowAddons: {
            checkbox: {
                24: '12',
                30: '18',
                36: '18',
                40: '18',
                48: '18',
                60: '18',
            },
            indentUnit: {
                24: 6,
                30: 12,
                36: 12,
                40: 24,
                48: 24,
                60: 24,
                default: 24,
            },
            indentWidth: {
                24: 12,
                30: 18,
                36: 18,
                40: 24,
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
            40: { lineHeight: 24, fontSize: 16 },
            48: { lineHeight: 24, fontSize: 16 },
            60: { lineHeight: 30, fontSize: 24 },
        },
    },
};
