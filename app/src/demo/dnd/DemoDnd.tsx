import * as React from 'react';
import sortBy from 'lodash.sortby';
import * as css from './DemoDnd.scss';
import { FlexCell, FlexRow, FlexSpacer, IconButton, Panel, Text } from '@epam/promo';
import * as addIcon from '@epam/assets/icons/common/content-add-outline-18.svg';
import { DropParams, getOrderBetween } from '@epam/uui';
import { DndModule, ModuleItem } from './DndModule';
import { DndSection, SectionItem } from './DndSection';
import { MaterialItem } from './DndMaterial';
import { defaultConfigModuleItems, defaultConfigSectionItems } from './defaultState';

interface DemoDndState {
    moduleItems: ModuleItem[];
    sectionItems: SectionItem[];
}

export class DemoDnd extends React.Component<{}, DemoDndState> {
    state: DemoDndState = {
        moduleItems: defaultConfigModuleItems,
        sectionItems: defaultConfigSectionItems,
    };

    getNewSectionItemsState = (srcData: MaterialItem, dstData: MaterialItem, newOrder: string) => {
        return this.state.sectionItems
            .map(section => {
                if (section.id === srcData.sectionId) {
                    return { ...section, materials: section.materials.filter(i => i.id !== srcData.id) };
                } else if (section.id === dstData.sectionId) {
                    return { ...section, materials: [...section.materials, { ...srcData, order: newOrder, sectionId: section.id }] };
                } else {
                    return section;
                }
            });
    }

    handleMaterialDropFromSection = ({ srcData, dstData, position }: DropParams<MaterialItem, MaterialItem>) => {
        const orderedMaterials = sortBy(this.state.sectionItems.find(i => i.id === dstData.sectionId).materials, ['order']);
        const dstMaterialIndex = orderedMaterials.findIndex(i => i.order === dstData.order);
        const prevMaterial = orderedMaterials[dstMaterialIndex - 1]?.order;
        const nextMaterial = orderedMaterials[dstMaterialIndex + 1]?.order;

        let newOrder = position === 'bottom'
                       ? getOrderBetween(dstData.order, nextMaterial)
                       : getOrderBetween(prevMaterial, dstData.order);

        this.setState({
            ...this.state,
            sectionItems: this.getNewSectionItemsState(srcData, dstData, newOrder),
        });
    }

    handleModuleChange = (newValue: ModuleItem) =>
        this.setState({ ...this.state, moduleItems: this.state.moduleItems.map(i => i.id === newValue.id ? newValue : i) })

    handleSectionChange = (newValue: SectionItem) =>
        this.setState({ ...this.state, sectionItems: this.state.sectionItems.map(i => i.id === newValue.id ? newValue : i) })

    render() {
        const sortedModules = sortBy(this.state.moduleItems, ['order']);
        const sortedSections = sortBy(this.state.sectionItems, ['order']);
        return (
            <FlexRow cx={ css.root } alignItems='top' >
                <Panel background='white' shadow>
                    <FlexCell minWidth={ 282 } >
                        <FlexRow padding='18' borderBottom>
                            <Text size='48' font='sans-semibold' >Modules</Text>
                            <FlexSpacer />
                            <IconButton icon={ addIcon } onClick={ () => {} } isDisabled />
                        </FlexRow>
                        <FlexCell cx={ css.moduleRowsContainer } >
                            { sortedModules.map((module, index) => <DndModule
                                key={ module.id }
                                value={ module }
                                prevModule={ sortedModules[index - 1] }
                                nextModule={ sortedModules[index + 1] }
                                onValueChange={ this.handleModuleChange }
                            />) }
                        </FlexCell>
                    </FlexCell>
                </Panel>
                <FlexSpacer />
                <FlexCell cx={ css.moduleContent } minWidth={ 894 } >
                    <Text font='museo-sans' cx={ css.moduleHeader } >Module 3: Module Name</Text>
                    { sortedSections.map((section, index) => <DndSection
                        key={ section.id }
                        prevSection={ sortedSections[index - 1] }
                        nextSection={ sortedSections[index + 1] }
                        value={ section }
                        onValueChange={ this.handleSectionChange }
                        onMaterialDropFromSection={ this.handleMaterialDropFromSection }
                    />) }
                </FlexCell>
            </FlexRow>
        );
    }
}