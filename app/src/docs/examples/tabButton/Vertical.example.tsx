import React, { useState } from "react";
import { FlexCell, TabButton } from "@epam/promo";

const VerticalTabButtonExample: React.FC = () => {
    const [value, onValueChange] = useState("Home");

    return (
        <FlexCell grow={ 1 }>
            <TabButton
                caption={ "Main" }
                isLinkActive={ value === "Main" }
                onClick={ () => onValueChange("Main") }
                size="36"
                direction="vertical"
            />
            <TabButton
                caption="Home"
                isLinkActive={ value === "Home" }
                onClick={ () => onValueChange("Home") }
                size="36"
                direction="vertical"
            />
            <TabButton
                caption={ "Tools" }
                isLinkActive={ value === "Tools" }
                onClick={ () => onValueChange("Tools") }
                count={ 18 }
                size="36"
                direction="vertical"
            />
            <TabButton
                caption={ "Options" }
                isLinkActive={ value === "Options" }
                onClick={ () => onValueChange("Options") }
                withNotify={ true }
                size="36"
                direction="vertical"
            />
        </FlexCell>
    );
};

export default VerticalTabButtonExample;