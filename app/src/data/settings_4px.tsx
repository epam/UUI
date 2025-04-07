import React from 'react';
import { ReactComponent as CircleLoaderIcon } from '@epam/assets/icons/loaders/circle-loader.svg';
import { FlexRow, IconContainer } from '@epam/uui';

const settings_4px = {
    alert: {
        sizes: {
            default: '56',
            actionMap: {
                56: '24',
            },
        },
    },
    badge: {
        sizes: {
            default: '24',
            countIndicatorMap: {
                24: '20',
                32: '20',
                40: '24',
            },
        },
    },
    button: {
        sizes: {
            default: '40',
        },
    },
    blocker: {
        renderSpinner: () => (
            <FlexRow rawProps={ { style: { height: '100%' } } } justifyContent="center" alignItems="center">
                <IconContainer size={ 48 } icon={ CircleLoaderIcon } />
            </FlexRow>
        ),
    },
    checkbox: {
        sizes: {
            default: '24',
        },
    },
    countIndicator: {
        sizes: {
            default: '24',
        },
    },
    dataTable: {
        sizes: {
            header: {
                row: '40',
                iconMap: {
                    40: '20',
                    48: '20',
                    60: '20',
                },
            },
            body: {
                row: '40',
                checkboxMap: {
                    40: '24',
                    48: '24',
                    60: '24',
                },
                iconMap: {
                    40: '20',
                    48: '20',
                    60: '24',
                },
                indentUnitMap: {
                    40: 24,
                    48: 24,
                    60: 24,
                },
                indentWidthMap: {
                    40: 24,
                    48: 24,
                    60: 24,
                },
            },
            columnsConfigurationModal: {
                columnRow: '32',
                countIndicator: '20',
                menuButton: '40',
                searchInput: '40',
            },
        },
    },
    datePicker: {
        sizes: {
            body: '48',
            input: '40',
        },
    },
    flexRow: {
        sizes: {
            default: '32',
        },
    },
    filtersPanel: {
        sizes: {
            default: '40',
            mobileFooterLinkButton: '48',
            pickerBodyMultiSwitch: '24',
            pickerBodyLinkButton: '24',
            pickerBodyMinWidth: 360,
            rangeDatePickerInput: '32',
        },
    },
    labeledInput: {
        sizes: {
            default: '40',
        },
    },
    linkButton: {
        sizes: {
            default: '40',
        },
    },
    modal: {
        sizes: {
            headerPadding: '24',
            footerColumnGap: '16',
            footerPadding: '24',
            footerVPadding: '32',
        },
    },
    notificationCard: {
        sizes: {
            action: '32',
        },
    },
    numericInput: {
        sizes: {
            default: '40',
        },
    },
    paginator: {
        sizes: {
            default: '32',
        },
    },
    pickerInput: {
        renderPlaceholder: () => 'Loading...',
        sizes: {
            toggler: {
                defaultSize: '40',
                tag: '40',
                tagMap: {
                    40: '32',
                    48: '32',
                },
            },
            body: {
                getSearchSize: () => '40',
                maxHeight: 300,
                minWidth: 360,
                padding: '12',
                row: '40',
                itemAvatarMap: {
                    40: '32',
                    48: '32',
                },
                itemAvatarMultilineMap: {
                    40: '40',
                    48: '48',
                },
                itemVerticalPaddingMap: {
                    40: '8',
                    48: '12',
                },
                selectIconMap: {
                    40: '24',
                    48: '24',
                },
                footerSwitchMap: {
                    40: '20',
                    48: '24',
                },
                mobileHeaderTitleSize: '48',
                mobileFooterLinkButton: '48',
                mobileRow: '48',
                mobileSearchInput: '48',
            },
        },
    },
    radioInput: {
        sizes: {
            default: '24',
        },
    },
    rangeDatePicker: {
        sizes: {
            default: '40',
            preset: '32',
        },
    },
    rating: {
        sizes: {
            default: '24',
        },
    },
    richTextView: {
        sizes: {
            default: '14',
        },
    },
    statusIndicator: {
        sizes: {
            default: '40',
        },
    },
    switch: {
        sizes: {
            default: '24',
        },
    },
    tabButton: {
        sizes: {
            default: '48',
            countIndicatorMap: {
                40: '24',
                48: '24',
                60: '24',
            },
        },
    },
    tag: {
        sizes: {
            default: '40',
            countIndicatorMap: {
                32: '20',
                40: '24',
                48: '24',
            },
        },
    },
    text: {
        sizes: {
            default: '40',
        },
    },
    textArea: {
        sizes: {
            default: '40',
        },
    },
    textInput: {
        sizes: {
            default: '40',
        },
    },
} as any;

export default settings_4px;
