import React from "react";
import {Button, FlexRow} from "@epam/promo";

interface IPresetsProps {
    presets: { id: string, name: string, isActive: boolean }[];
}

const Presets: React.FC<IPresetsProps> = ({presets}) => {
    return (
        <FlexRow spacing='6' size='48' padding='18' >
            { presets.map(preset => {
                const fill = preset.isActive ? "solid" : "white";

                return <Button key={ preset.id } size='24' caption={ preset.name } fill={ fill }/>;
            }) }
        </FlexRow>
    );
};

export default React.memo(Presets);