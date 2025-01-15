export const i18n = {
    mainMenu: {
        moreButtonCaption: 'More',
    },
    datePicker: {
        locale: 'en',
    },
    pickerList: {
        rowsSelected: (rows: number) => ` (${rows} selected)`,
        showAll: 'SHOW ALL',
    },
    pickerToggler: {
        createItemValue: (length: number, entityName: string) => `${length} ${entityName}`,
    },
    pickerInput: {
        defaultPlaceholder: (entity: string) => `Please select ${entity}`,
    },
    labeledInput: {
        optionalFieldLabel: 'This field is optional',
    },
    numericInput: {
        locale: undefined as string,
    },
};
