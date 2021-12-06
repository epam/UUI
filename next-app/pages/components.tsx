import {AccordionExample, ButtonExample, IconExample, InputExample, LoaderExample} from "../components/lib";

const Components = () => {
    return (
        <div className={ 'withGap' }>
            <ButtonExample />
            <InputExample />
            <LoaderExample />
            <IconExample />
            <AccordionExample />
        </div>
    );
};

export default Components;