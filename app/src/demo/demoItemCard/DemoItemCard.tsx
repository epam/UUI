import { Anchor, Text } from "@epam/promo";
import * as css from "./DemoItemCard.scss";
import * as React from "react";
import { DemoItem } from "../structure";
import { SlateEditor } from "@epam/uui-editor";
import { EditableDocContent } from "../../common";
import { useEffect } from "react";
import { svc } from "../../services";
import { Value } from "slate";
import { getDemoDescriptionFileName } from "../../common/appFooterDemo/demoToolbar/DescriptionModal";
import { Blocker } from "@epam/loveship";


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
    const fileName = getDemoDescriptionFileName(name);

    useEffect(() => {
        let isOutdated = false;
        setIsLoading(true);
        svc.uuiApi.processRequest('/api/get-doc-content', 'POST', { name: fileName })
            .then(res => {
                if (isOutdated) {
                    return;
                }
                const newDescr = res.content ? Value.fromJSON(res.content) : null;
                setDescription(newDescr);
                setIsLoading(false);
            });

        return () => {
            isOutdated = true;
        };
    }, [fileName]);

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
