import { TPropEditorType, TPropEditorTypeOverride } from '@epam/uui-docs';

const propsOverride: TPropEditorTypeOverride = {
    '@epam/uui:AlertProps': {
        size: {
            editor: {
                type: TPropEditorType.oneOf,
                options: ['56'],
            },
            comment: {
                tags: {
                    '@default': '56',
                },
            },
        },
    },
    '@epam/uui:ButtonProps': {
        size: {
            editor: {
                type: TPropEditorType.oneOf,
                options: ['40', '48'],
            },
            comment: {
                tags: {
                    '@default': '40',
                },
            },
        },
    },
    '@epam/uui:IconButtonProps': {
        size: {
            editor: {
                type: TPropEditorType.oneOf,
                options: ['20', '24'],
            },
        },
    },
    '@epam/uui:BadgeProps': {
        size: {
            editor: {
                type: TPropEditorType.oneOf,
                options: ['24', '32', '40'],
            },
            comment: {
                tags: {
                    '@default': '32',
                },
            },
        },
    },
    '@epam/uui:LinkButtonProps': {
        size: {
            editor: {
                type: TPropEditorType.oneOf,
                options: ['24', '32', '40'],
            },
            comment: {
                tags: {
                    '@default': '40',
                },
            },
        },
    },
    '@epam/uui:TextInputProps': {
        size: {
            editor: {
                type: TPropEditorType.oneOf,
                options: ['40', '48'],
            },
            comment: {
                tags: {
                    '@default': '40',
                },
            },
        },
    },
    '@epam/uui:NumericInputProps': {
        size: {
            editor: {
                type: TPropEditorType.oneOf,
                options: ['40', '48'],
            },
            comment: {
                tags: {
                    '@default': '40',
                },
            },
        },
    },
    '@epam/uui:CheckboxProps': {
        size: {
            editor: {
                type: TPropEditorType.oneOf,
                options: ['20', '24', '28'],
            },
            comment: {
                tags: {
                    '@default': '24',
                },
            },
        },
    },
    '@epam/uui:CheckboxGroupProps': {
        size: {
            editor: {
                type: TPropEditorType.oneOf,
                options: ['20', '24', '28'],
            },
            comment: {
                tags: {
                    '@default': '24',
                },
            },
        },
    },
    '@epam/uui:RadioInputProps': {
        size: {
            editor: {
                type: TPropEditorType.oneOf,
                options: ['20', '24', '28'],
            },
            comment: {
                tags: {
                    '@default': '24',
                },
            },
        },
    },
    '@epam/uui:RadioGroupProps': {
        size: {
            editor: {
                type: TPropEditorType.oneOf,
                options: ['20', '24', '28'],
            },
            comment: {
                tags: {
                    '@default': '24',
                },
            },
        },
    },
    '@epam/uui:SwitchProps': {
        size: {
            editor: {
                type: TPropEditorType.oneOf,
                options: ['20', '24'],
            },
            comment: {
                tags: {
                    '@default': '24',
                },
            },
        },
    },
    '@epam/uui:TabButtonProps': {
        size: {
            editor: {
                type: TPropEditorType.oneOf,
                options: ['48'],
            },
            comment: {
                tags: {
                    '@default': '48',
                },
            },
        },
    },
    '@epam/uui:PickerInputProps': {
        size: {
            editor: {
                type: TPropEditorType.oneOf,
                options: ['40', '48'],
            },
            comment: {
                tags: {
                    '@default': '40',
                },
            },
        },
    },
    '@epam/uui:CountIndicatorProps': {
        size: {
            editor: {
                type: TPropEditorType.oneOf,
                options: ['20', '24'],
            },
            comment: {
                tags: {
                    '@default': '24',
                },
            },
        },
    },
    '@epam/uui:DatePickerProps': {
        size: {
            editor: {
                type: TPropEditorType.oneOf,
                options: ['40', '48'],
            },
            comment: {
                tags: {
                    '@default': '40',
                },
            },
        },
    },
    '@epam/uui:RangeDatePickerProps': {
        size: {
            editor: {
                type: TPropEditorType.oneOf,
                options: ['40', '48'],
            },
        },
    },
    '@epam/uui:RatingProps': {
        size: {
            editor: {
                type: TPropEditorType.oneOf,
                options: ['20', '24'],
            },
            comment: {
                tags: {
                    '@default': '20',
                },
            },
        },
    },
    '@epam/uui:PaginatorProps': {
        size: {
            editor: {
                type: TPropEditorType.oneOf,
                options: ['24', '32'],
            },
            comment: {
                tags: {
                    '@default': '24',
                },
            },
        },
    },
    '@epam/uui:StatusIndicatorProps': {
        size: {
            editor: {
                type: TPropEditorType.oneOf,
                options: ['20', '24', '28'],
            },
            comment: {
                tags: {
                    '@default': '24',
                },
            },
        },
    },
    '@epam/uui:TagProps': {
        size: {
            editor: {
                type: TPropEditorType.oneOf,
                options: ['32', '40', '48'],
            },
            comment: {
                tags: {
                    '@default': '40',
                },
            },
        },
    },
    '@epam/uui:DataTableProps': {
        size: {
            editor: {
                type: TPropEditorType.oneOf,
                options: ['32', '40', '48'],
            },
            comment: {
                tags: {
                    '@default': '40',
                },
            },
        },
    },
    '@epam/uui:LabeledInputProps': {
        size: {
            editor: {
                type: TPropEditorType.oneOf,
                options: ['40', '48'],
            },
            comment: {
                tags: {
                    '@default': '40',
                },
            },
        },
    },
    '@epam/uui:TextPlaceholderProps': {
        size: {
            editor: {
                type: TPropEditorType.oneOf,
                options: ['40', '48'],
            },
            comment: {
                tags: {
                    '@default': '40',
                },
            },
        },
    },
    '@epam/uui:FlexRowProps': {
        size: {
            editor: {
                type: TPropEditorType.oneOf,
                options: ['24', '32', '40', '48'],
            },
            comment: {
                tags: {
                    '@default': '40',
                },
            },
        },
    },
    '@epam/uui:TimePickerProps': {
        size: {
            editor: {
                type: TPropEditorType.oneOf,
                options: ['40', '48'],
            },
            comment: {
                tags: {
                    '@default': '40',
                },
            },
        },
    },
    '@epam/uui:MultiSwitchProps': {
        size: {
            editor: {
                type: TPropEditorType.oneOf,
                options: ['40', '48'],
            },
            comment: {
                tags: {
                    '@default': '40',
                },
            },
        },
    },
    '@epam/uui:VerticalTabButtonProps': {
        size: {
            editor: {
                type: TPropEditorType.oneOf,
                options: ['40', '48'],
            },
            comment: {
                tags: {
                    '@default': '40',
                },
            },
        },
    },
};

export default propsOverride;
