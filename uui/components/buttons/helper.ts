import { ButtonProps } from '@epam/uui-components';

export function getIconClass(props: ButtonProps) {
    const classList = {
        'has-left-icon': false,
        'has-right-icon': false,
    };

    if (props.onClear) {
        classList['has-right-icon'] = true;
    }

    if (props.isDropdown) {
        classList['has-right-icon'] = true;
    }

    if (props.icon) {
        classList[props.iconPosition !== 'right' ? 'has-left-icon' : 'has-right-icon'] = true;
    }

    return [classList['has-left-icon'] ? 'uui-has-left-icon' : 'uui-no-left-icon', classList['has-right-icon'] ? 'uui-has-right-icon' : 'uui-no-right-icon'];
}
