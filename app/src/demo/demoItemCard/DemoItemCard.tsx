import { Anchor, Text } from "@epam/promo";
import * as css from "./DemoItemCard.scss";
import * as React from "react";
import { DemoItem } from "../structure";
import { SlateEditor } from "@epam/uui-editor";
import { EditableDocContent } from "../../common";
import { useEffect } from "react";
import { Blocker } from "@epam/loveship";
import { loadDocContentByDemoName } from "../../common/appFooterDemo/demoToolbar/useDemoDescriptionEditor";

export interface IDemoItemCard {
    demoItem: DemoItem;
    onOpenItem: (name: string) => void;
}
export function DemoItemCard(props: IDemoItemCard) {
    const {
        onOpenItem,
        demoItem: {
            previewImage,
            name,
            id,
        },
    } = props;

    const [isLoading, setIsLoading] = React.useState(false);
    const [description, setDescription] = React.useState(null);

    useEffect(() => {
        let isOutdated = false;
        setIsLoading(true);
        loadDocContentByDemoName(name)
            .then(content => {
                if (isOutdated) {
                    return;
                }
                setDescription(content);
            })
            .finally(() => setIsLoading(false));

        return () => {
            isOutdated = true;
            setIsLoading(false);
        };
    }, [name]);

    return (
        <Anchor cx={ css.container } key={ id } link={ { pathname: '/demo', query: { id } } } onClick={ () => onOpenItem(name) } >
            <div className={ css.navCard } style={ { backgroundImage: `url(${previewImage})` } } />
            <div className={ css.navDescription }>
                <Text cx={ css.title } font='sans-semibold' lineHeight='30' fontSize='24'>{ name }</Text>
                <div className={ css.description }>
                    <SlateEditor
                        plugins={ EditableDocContent.plugins }
                        mode='inline'
                        isReadonly={ true }
                        minHeight={ 10 }
                        fontSize="14"
                        value={ description }
                        onValueChange={ null }
                    />
                    <Blocker isEnabled={ isLoading } />
                </div>
            </div>
        </Anchor>
    );
}
