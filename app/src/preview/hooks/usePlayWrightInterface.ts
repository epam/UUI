import { PlayWrightInterfaceName } from '../constants';
import { svc } from '../../services';
import { Link } from '@epam/uui-core';

export function usePlayWrightInterface() {
    (window as any)[PlayWrightInterfaceName] = {
        clientRedirect: (linkJson: string) => {
            const link = JSON.parse(linkJson) as Link;
            svc.uuiRouter.redirect(link);
        },
    };
}
