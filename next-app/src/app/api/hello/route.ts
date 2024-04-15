import { NextResponse } from 'next/server';

import 'server-only';

/**
 * See https://nextjs.org/docs/app/building-your-application/routing/route-handlers
 */
export const GET = (req: Request) => {
    // TypeScript Warning: Response.json() is only valid from TypeScript 5.2.
    // If you use a lower TypeScript version, you can use NextResponse.json() for typed responses instead.
    return NextResponse.json({ name: 'John Doe' });
};
