import { PropsWithChildren } from "react";
import { getAppContext } from "../helpers/appContext";
import { AppView } from "./AppView";

export default async function AppContext({ children }: PropsWithChildren) {
    const appContext = await getAppContext();
    return <AppView appContext={appContext}>{children}</AppView>;
}
