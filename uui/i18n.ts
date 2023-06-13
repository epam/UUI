import { i18n as uuiI18n } from '@epam/uui-core';

export const i18n = {
    ...uuiI18n,
    dataPickerBody: {
        searchPlaceholder: 'Search',
        noRecordsMessage: 'No records found',
        noRecordsSubTitle: 'Check your spelling, or search for a different keyword',
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
            resetToDefaultButton: 'Reset to Default',
            displayedSectionTitle: 'Displayed in table',
            hiddenSectionTitle: 'Hidden in table',
            searchPlaceholder: 'Search by column name',
            noResultsFound: {
                text: 'No results found',
                subText: 'We can’t find any item matching your request',
            },
            enableAtLeastOneColumnMessage: 'Please enable at least one column',
            pinColumnButton: 'Pin column',
            unPinColumnButton: 'Unpin column',
            lockedColumnPinButton: 'You cannot unpin this column',
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
};
