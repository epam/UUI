import React from "react";
import {presets} from "../../data";

const Presets: React.FC = () => {
    return (
        <>
            { presets.map(preset => (
                <div>
                    { preset.name }
                </div>
            )) }
        </>
    );
};

export default React.memo(Presets);