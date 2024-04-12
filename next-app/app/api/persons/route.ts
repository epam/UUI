import { HEADERS, UUI_API_POINT } from "../../../helpers/apiHelper";
import { NextResponse } from "next/server";

// TODO: make 'server-only'
export async function POST(req: Request) {
    try {
        const reqData = await req.json();

        // TODO: make separate catch for fetch to expose reqeust error code
        const personDataRes = await fetch(`${UUI_API_POINT}/persons`, {
            headers: new Headers(HEADERS),
            method: "POST",
            body: JSON.stringify(reqData),
        });

        const data = await personDataRes.json();

        // TypeScript Warning: Response.json() is only valid from TypeScript 5.2.
        // If you use a lower TypeScript version, you can use NextResponse.json() for typed responses instead.
        return NextResponse.json(data);
    } catch (error) {
        console.log(error);
        return new Response(`Cant perform request: ${(error as any).message}`, {
            status: 500,
        });
    }
}
