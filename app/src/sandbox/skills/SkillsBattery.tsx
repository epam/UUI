import React, { useState } from "react";
import { RatingWithMods } from "./RatingWidthMods";


export const SkillsBattery = () => {
    const [value, onValueChange] = useState(0);

    return (
        <div>
            <RatingWithMods value={ value } onValueChange={ onValueChange } />
        </div>
    );
};