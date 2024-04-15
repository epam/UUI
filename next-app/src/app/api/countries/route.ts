import { HEADERS, UUI_API_POINT } from '../../../helpers/apiHelper';

import 'server-only';

export async function POST(req: Request) {
    const reqData = await req.json();

    return await fetch(`${UUI_API_POINT}/countries`, {
        headers: new Headers(HEADERS),
        method: 'POST',
        body: JSON.stringify(reqData),
        credentials: 'include',
    });
}
