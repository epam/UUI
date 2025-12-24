/* eslint-disable @typescript-eslint/no-unused-vars */
import { useUuiContext } from '@epam/uui-core';

export default function SendRequestExample() {
    const svc = useUuiContext();
    
    svc.uuiApi.processRequest('api/apiPath', 'GET')
        .then((data) => { /* Your data manipulation logic */ });

    svc.uuiApi.processRequest('api/apiPath', 'POST', { payload: {} });

    svc.uuiApi.processRequest(
        'api/apiPath',
        'POST',
        { payload: {} },
        {
            fetchOptions: { /* native Fetch method options */ },
        },
    );
}
