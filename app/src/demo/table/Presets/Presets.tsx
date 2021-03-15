import React from "react";
import {Button, FlexRow} from "@epam/promo";

interface IPresetsProps {
    presets: { id: string, name: string, isActive: boolean }[];
}

const Presets: React.FC<IPresetsProps> = ({presets}) => {
    return (
        <FlexRow padding="18" vPadding="18">
            { presets.map(preset => {
                const fill = preset.isActive ? "solid" : "white";

                return (
                    <div>
                        <Button caption={ preset.name } fill={ fill }/>
                    </div>
                );
            }) }
        </FlexRow>
    );
};

export default React.memo(Presets);