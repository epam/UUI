import * as uuiDocs from '../../../../../docs/_props/uui/docs';
import * as electricDocs from '../../../../../docs/_props/epam-electric/docs';
import * as loveshipDocs from '../../../../../docs/_props/loveship/docs';
import * as promoDocs from '../../../../../docs/_props/epam-promo/docs';
import { TSkin } from '@epam/uui-docs';

const DOCS_SKIN_SPECIFIC = {
    colorDoc: {
        [TSkin.UUI]: uuiDocs.colorDoc,
        [TSkin.Electric]: electricDocs.colorDoc,
        [TSkin.Loveship]: loveshipDocs.colorDoc,
        [TSkin.Promo]: promoDocs.colorDoc,
    },
};
const DOCS_SKIN_AGNOSTIC = {
    pickerBaseOptionsDoc: uuiDocs.pickerBaseOptionsDoc,
    iconWithInfoDoc: uuiDocs.iconWithInfoDoc,
};

export function getDocBySkin<S extends TSkin, K extends (keyof typeof DOCS_SKIN_SPECIFIC)>(skin: S, name: K): (typeof DOCS_SKIN_SPECIFIC)[K][S] {
    return DOCS_SKIN_SPECIFIC[name][skin];
}

export function getCommonDoc<K extends (keyof typeof DOCS_SKIN_AGNOSTIC)>(name: K): (typeof DOCS_SKIN_AGNOSTIC)[K] {
    return DOCS_SKIN_AGNOSTIC[name];
}
