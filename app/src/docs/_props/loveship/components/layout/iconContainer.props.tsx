import { DocBuilder } from '@epam/uui-docs';
import { ControlIconProps } from '@epam/uui-components';
import { DefaultContext, FormContext, onClickDoc, iconDoc } from '../../docs';
import { IconContainer, IconContainerMods } from '@epam/loveship';

const iconContainerDoc = new DocBuilder<ControlIconProps & IconContainerMods>({ name: 'IconContainer', component: IconContainer })
    .implements([onClickDoc, iconDoc])
    .prop('size', {
        examples: [
            12, 18, 24, 30, 36, 42, 48, 60,
        ],
    })
    .prop('style', {
        examples: [
            { name: 'fill: night600', value: { fill: '#6C6F80' } }, { name: 'fill: sky', value: { fill: '#30B6DD' } }, { name: 'fill: fire', value: { fill: '#FF4E33' } }, { name: 'transform: skew(30deg, 20deg)', value: { transform: 'skew(30deg, 20deg)' } },
        ],
    })
    .prop('flipY', { examples: [true, false], defaultValue: null })
    .prop('rotate', {
        examples: [
            '0', '90cw', '180', '90ccw',
        ],
        defaultValue: null,
    })
    .withContexts(DefaultContext, FormContext);

export default iconContainerDoc;
