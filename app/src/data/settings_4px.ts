import { Settings } from '@epam/uui';

const settings_4px: Settings = {
    sizes: {
        defaults: {
            alert: '48',
            badge: '24',
            button: '40',
            checkbox: '24',
            countIndicator: '24',
            flexRow: '40',
            filtersPanel: '40',
            linkButton: '40',
            numericInput: '40',
            radioInput: '24',
            richTextView: '14',
            switch: '24',
            tabButton: '48',
            tag: '40',
            text: '40',
            textArea: '40',
            textInput: '40',
            rangeDatePicker: '40',
            datePicker: '40',
            labeledInput: '40',
            statusIndicator: '40',
            paginator: '32',
            rating: '24',
        },
        alert: {
            action: {
                32: '24',
                48: '32',
            },
        },
        notificationCard: {
            action: '32',
        },
        tag: {
            countIndicator: {
                32: '20',
                40: '24',
                48: '24',
            },
        },
        pickerInput: {
            toggler: {
                defaults: {
                    size: '40',
                    tag: '40',
                },
                tag: {
                    40: '32',
                    48: '32',
                },
            },
            body: {
                dropdown: {
                    height: 300,
                    width: 360,
                    padding: '12',
                    row: {
                        default: '40',
                        cell: {
                            padding: '24',
                            text: {
                                40: '40',
                                48: '48',
                            },
                            icon: {
                                40: '24',
                                48: '24',
                            },
                            isBoldSelectionIcon: {
                                24: true,
                            },
                            item: {
                                default: '40',
                                verticalPadding: {
                                    40: '8',
                                    48: '12',
                                },
                                avatar: {
                                    rest: {
                                        40: '32',
                                        48: '32',
                                    },
                                    multiline: {
                                        40: '40',
                                        48: '48',
                                    },
                                },
                            },
                        },
                    },
                    footer: {
                        switch: {
                            40: '20',
                            48: '24',
                        },
                        linkButton: {
                            40: '32',
                            48: '32',
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
                    row: '40',
                    padding: '24',
                },
            },
        },
        rowAddons: {
            defaults: {
                icon: '20',
                indentUnit: 24,
                indentWidth: 12,
            },
            checkbox: {
                40: '24',
                48: '24',
                60: '24',
            },
            icon: {
                40: '20',
                48: '20',
                60: '24',
            },
            indentUnit: {
                40: 24,
                48: 24,
                60: 24,
            },
            indentWidth: {
                40: 24,
                48: 24,
                60: 24,
            },
        },
        text: {
            20: { lineHeight: 12, fontSize: 10 },
            24: { lineHeight: 18, fontSize: 12 },
            32: { lineHeight: 18, fontSize: 14 },
            40: { lineHeight: 24, fontSize: 16 },
            48: { lineHeight: 24, fontSize: 16 },
            60: { lineHeight: 30, fontSize: 24 },
        },
        filtersPanel: {
            pickerInput: {
                body: {
                    default: '40',
                },
            },
        },
        labeledInput: {
            fillIcon: ['24', '32'],
        },
        badge: {
            countIndicator: {
                24: '20',
                32: '20',
                48: '24',
            },
        },
        dataTable: {
            header: {
                row: {
                    default: '40',
                    cell: {
                        defaults: {
                            size: '40',
                            resizeMarker: '12',
                            padding: '12',
                            paddingEdge: '24',
                        },
                        checkbox: {
                            40: '24',
                            48: '24',
                            60: '24',
                        },
                        columnCaption: {
                            fontSize: '14',
                            fontWeight: '400',
                            size: '20',
                            uppercase: '12',
                        },
                        iconSize: {
                            40: '20',
                            48: '20',
                            60: '20',
                        },
                        truncate: ['48'],
                    },
                    groupCell: {
                        defaults: {
                            size: '40',
                            padding: '12',
                            paddingEdge: '24',
                        },
                        columnCaption: {
                            fontSize: '14',
                            fontWeight: '400',
                            size: '20',
                            uppercase: '12',
                        },
                        iconSize: {
                            40: '20',
                            48: '20',
                            60: '20',
                        },
                        truncate: ['48'],
                    },
                },
            },
            body: {
                row: {
                    default: '40',
                    cell: {
                        defaults: {
                            size: '40',
                            padding: '12',
                            paddingEdge: '24',
                        },
                        text: {
                            24: '24',
                            32: '32',
                            40: '40',
                            48: '48',
                            60: '48',
                        },
                    },
                },
            },
            columnsConfigurationModal: {
                columnRow: '40',
                countIndicator: '20',
                subgroupIcon: '20',
                search: '40',
                width: 560,
            },
        },
        modal: {
            window: {
                defaults: {
                    width: 560,
                },
            },
        },
        tabButton: {
            countIndicator: {
                40: '24',
                48: '24',
                60: '24',
            },
        },
    },
};

export default settings_4px;
