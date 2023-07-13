import { MainPage } from './pages/MainPage';
import { Route } from 'react-router-dom';
import { MainMenu, MainMenuButton } from "@epam/uui";
import logo from "./icons/logo.svg";

export function App() {
    return (
        <>
            <Route component={AppHeader} />
            <Route path="/" component={MainPage} />
        </>
    )
}

function AppHeader() {
    return (
        <MainMenu appLogoUrl={logo}>
            <MainMenuButton
                caption="Home"
                link={{ pathname: '/' }}
                priority={1}
                estimatedWidth={72}
            />
        </MainMenu>
    );
}
