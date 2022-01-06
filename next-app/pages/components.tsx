import {AccordionExample, ButtonExample, IconExample, InputExample, LoaderExample} from "../components/lib";
import React from "react";

const Components = () => {
    return (
        <div className={ 'withGap' }>
            <h2>Demo example with list of components</h2>
            <ButtonExample />
            <InputExample />
            <LoaderExample />
            <IconExample />
            <AccordionExample />
        </div>
    );
};

export default Components;