import type { Settings } from './settings.types';

export const settings: Settings = {
    sizes: {
        defaults: {
            badge: '36',
            button: '36',
            checkbox: '18',
            countIndicator: '24',
            linkButton: '36',
            numericInput: '36',
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
        pickerInput: {
            toggler: {
                defaults: {
                    size: '36',
                    tag: '36',
                },
                tag: {
                    24: '18',
                    30: '18',
                    36: '24',
                    42: '30',
                    48: '36',
                    60: '42',
                },
            },
            body: {
                dropdown: {
                    height: 300,
                    width: 360,
                    padding: '12',
                    row: {
                        default: '36',
                        cell: {
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
                            isBoldSelectionIcon: {
                                24: true,
                            },
                            item: { // max 48, setup by row with 60????
                                default: '36',
                                verticalPadding: { // TODO: try to move to size css classes, compare different components
                                    24: '3',
                                    30: '6',
                                    36: '9',
                                    42: '6',
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
                        },
                    },
                    footer: {
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
                        },
                    },
                },
                mobile: {
                    header: {
                        titleSize: '48',
                    },
                    footer: {
                        linkButton: '48',
                    },
                    row: '48',
                    searchInput: '48',
                },
                modal: {
                    row: '36',
                    padding: '24',
                },
            },
        },
        rowAddons: {
            defaults: {
                icon: '18',
                indentUnit: 24,
                indentWidth: 12,
            },
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
            },
            indentWidth: {
                24: 12,
                30: 18,
                36: 18,
                42: 24,
                48: 24,
                60: 24,
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
        filtersPanel: {
            pickerInput: {
                body: {
                    default: '36',
                },
            },
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
        dataTable: {
            header: {
                row: {
                    default: '36',
                    cell: {
                        defaults: {
                            size: '36',
                            resizeMarker: '12',
                            padding: '12',
                            paddingEdge: '24',
                        },
                        checkbox: {
                            36: '18',
                            48: '18',
                            60: '18',
                        },
                        columnCaption: {
                            fontSize: '14',
                            fontWeight: '400',
                            size: '30',
                            uppercase: '12',
                        },
                        iconSize: {
                            36: '18',
                            48: '18',
                            60: '18',
                        },
                        truncate: ['48'],
                    },
                },
            },
            body: {
                row: {
                    default: '36',
                    cell: {
                        defaults: {
                            size: '36',
                            padding: '12',
                            paddingEdge: '24',
                        },
                        text: {
                            18: '18',
                            24: '24',
                            30: '30',
                            36: '36',
                            42: '42',
                            48: '48',
                            60: '48',
                        },
                    },
                },
            },
            columnsConfigurationModal: {
                columnRow: '30',
                countIndicator: '18',
                subgroupIcon: '18',
                search: '30',
                width: '560',
            },
        },
        modal: {
            window: {
                defaults: {
                    width: '420',
                },
            },
        },
        tabButton: {
            countIndicator: {
                36: '18',
                48: '18',
                60: '18',
            },
        },
    },
};
