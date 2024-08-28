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
            dataTableCell: '36',
            dataTableRow: '36',
            dataTableHeaderCell: '36',
            dataTableHeaderRow: '36',
            paginator: '30',
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
            columnGap: '12',
            verticalPadding: {
                24: '3',
                30: '6',
                36: '6',
                42: '9',
                48: '9',
            },
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
                36: '18',
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
                default: '18',
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
        dataTableHeaderCell: {
            checkbox: {
                36: '18',
                48: '18',
                60: '18',
            },
            columnCaption: {
                fontSize: '14',
                fontWeight: '400',
                lineHeight: '30',
                size: '30',
                uppercase: '12',
            },
            iconSize: {
                36: '18',
                48: '18',
                60: '18',
            },
            resizeMarker: {
                default: '12',
            },
            leftPadding: {
                default: '12',
                utmost: '24',
            },
            rightPadding: {
                default: '12',
                utmost: '24',
            },
            tooltip: {
                caption: {
                    fontSize: '14',
                    fontWeight: '600',
                },
                info: {
                    fontSize: '12',
                    fontWeight: '400',
                },
            },
        },
        dataTableHeaderRow: {
            iconSize: {
                36: '18',
                48: '18',
                60: '18',
            },
            truncate: ['48'],
        },
        dataTableCell: {
            text: {
                18: '18',
                24: '24',
                30: '30',
                36: '36',
                42: '42',
                48: '48',
                60: '48',
            },
            leftPadding: {
                editable: '0',
                default: '12',
                utmost: '24',
            },
            rightPadding: {
                editable: '0',
                default: '12',
                utmost: '24',
            },
        },
        dataTableRow: {
            columnsGap: {
                default: '24',
            },
        },
        dataTableColumnsConfigurationModal: {
            columnRowSize: '30',
            columnGap: '6',
            padding: '24',
            pinIconButtonGap: '12',
            groupTitleSize: '18',
            groupTitleFontSize: '14',
            groupTitleFontWeight: '600',
            subgroupTitleSize: '12',
            subgroupTitleFontSize: '10',
            subgroupTitleFontWeight: '600',
            subgroupTitleIconSize: '18',
            searchAreaSize: '42',
            searchSize: '30',
            noFoundTitleSize: '30',
            noFoundTitleFontSize: '24',
            noFoundTitleFontWeight: '600',
            noFoundSubTitleSize: '24',
            noFoundSubTitleFontSize: '16',
            noFoundSubTitleFontWeight: '400',
        },
        paginator: {},
    },
};
