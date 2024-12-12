import { ReactNode } from 'react';
import { i18n as uuiI18n } from '@epam/uui-core';

const TREE_SHAKEABLE_INIT = () => ({
    ...uuiI18n,
    dataPickerBody: {
        searchPlaceholder: 'Search',
        noRecordsMessage: 'No records found',
        noRecordsSubTitle: 'Check your spelling, or search for a different keyword',
        typeSearchToLoadMessage: 'Type search to load items',
    },
    pickerModal: {
        headerTitle: 'Please select',
        searchPlaceholder: 'Type text for quick search',
        cancelButton: 'Cancel',
        selectButton: 'Select',
        clearAllButton: 'CLEAR ALL',
        selectAllButton: 'SELECT ALL',
    },
    pickerInput: {
        showOnlySelectedLabel: 'Show only selected',
        clearSelectionButton: 'CLEAR ALL',
        clearSelectionButtonSingle: 'CLEAR',
        selectAllButton: 'SELECT ALL',
        doneButton: 'DONE',
    },
    notificationCard: {
        closeAllNotificationsButton: 'CLOSE ALL NOTIFICATIONS',
    },
    form: {
        notifications: {
            actionButtonCaption: 'Restore',
            unsavedChangesMessage: 'You have unsaved changes. Click Restore button if you would like to recover the data',
        },
        modals: {
            beforeLeaveMessage: 'Your data may be lost. Do you want to save data?',
            discardButton: 'Discard',
            saveButton: 'Save',
        },
    },
    rangeDatePicker: {
        pickerPlaceholderFrom: 'From:',
        pickerPlaceholderTo: 'To:',
    },
    tables: {
        noResultsBlock: {
            title: 'No results found',
            message: 'We can’t find any item matching your request',
        },
        columnsConfigurationModal: {
            applyButton: 'Apply',
            cancelButton: 'Cancel',
            selectAllButton: 'Select all',
            clearAllButton: 'Clear all',
            checkAllButton: 'Check All',
            uncheckAllButton: 'Uncheck All',
            configureColumnsTitle: 'Configure columns',
            pinnedToTheLeftSubgroupTitle: 'Pinned to the left',
            pinnedToTheRightSubgroupTitle: 'Pinned to the right',
            notPinnedSubgroupTitle: 'Not pinned',
            resetToDefaultButton: 'Reset to Default',
            displayedSectionTitle: 'Displayed in table',
            hiddenSectionTitle: 'Hidden in table',
            searchPlaceholder: 'Search by column name',
            noResultsFound: {
                title: 'No results found',
                subTitle: 'We can’t find any item matching your request',
            },
            enableAtLeastOneColumnMessage: 'Please enable at least one column',
            pinColumnToTheLeftButton: 'Pin column to left',
            pinColumnToTheRightButton: 'Pin column to right',
            unPinColumnButton: 'Unpin column',
            lockedColumnPinButton: 'You cannot unpin this column',
        },
        columnHeader: {
            collapseAllTooltip: 'Collapse All',
            expandAllTooltip: 'Expand All',
        },
    },
    pickerFilterHeader: {
        sortAscending: 'Sort Ascending',
        sortDescending: 'Sort Descending',
    },
    filterToolbar: {
        addCaption: 'Add filter',
        datePicker: {
            placeholder: 'Select date',
            removeCaption: 'REMOVE FILTER',
            clearCaption: 'CLEAR',
        },
        rangeDatePicker: {
            emptyPickerPlaceholder: 'Select period',
            emptyPlaceholderFrom: 'Select From',
            emptyPlaceholderTo: 'Select To',
        },
        pickerInput: {
            itemsPlaceholder: 'items',
        },
    },
    presetPanel: {
        addCaption: 'Add Preset',
    },
    confirmationModal: {
        discardButton: 'Discard',
        saveButton: 'Save',
    },
    fileUpload: {
        labelStart: 'Drop files to attach or',
        browse: 'browse',
        labelEnd: 'your local files',
    },
    fileCard: {
        fileSizeProgress: ' of ',
        failedUploadErrorMessage: 'Upload failed',
    },
    errorHandler: {
        errorPageConfig: {
            notFound: {
                title: 'Oooops! We couldn’t find this page',
                subtitle: 'Sorry for the inconvenience.',
            },
            permissionDenied: {
                title: 'You have no permissions!',
                subtitle: 'Sorry for the inconvenience.',
            },
            serverError: {
                title: '500 Error! Something went wrong',
                subtitle: 'Sorry for the inconvenience, we’ll get it fixed.',
            },
            serviceUnavailable: {
                title: 'The page request was canceled, because it took too long to complete',
                subtitle: 'Sorry for the inconvenience, we’ll get it fixed.',
            },
            default: {
                title: 'Something went wrong',
                subtitle: 'Sorry for the inconvenience, we’ll get it fixed.',
            },
        },
        recoveryMessageConfig: {
            'auth-lost': {
                title: 'Your session has expired.',
                subtitle: 'Attempting to log you in.',
            },
            'connection-lost': {
                title: 'Network connection down',
                subtitle: 'Please check your network connection.',
            },
            maintenance: {
                title: 'Server maintenance',
                subtitle: 'We apologize for the inconvenience. Our site is currently under maintenance. Will come back as soon as possible.',
            },
            'server-overload': {
                title: 'Server overloaded',
                subtitle: 'We are trying to recover. Please wait.',
            },
        },
        supportMessage: undefined as ReactNode,
    },
});

export const i18n = TREE_SHAKEABLE_INIT();
