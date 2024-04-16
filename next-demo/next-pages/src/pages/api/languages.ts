import { NextApiRequest, NextApiResponse } from 'next';
import { HEADERS, UUI_API_POINT } from '../../helpers/apiHelper';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    try {
        const personDataRes = await fetch(`${UUI_API_POINT}/languages`, {
            headers: HEADERS,
            method: req.method,
            body: JSON.stringify(req.body),
        });
        const data = await personDataRes.json();
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
    }
}
