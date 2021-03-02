import * as React from 'react';
import sortBy from 'lodash.sortby';
import { DragHandle } from '@epam/uui-components';
import { DndActor, IEditable, cx, uuiDndState, DropParams, getOrderBetween } from '@epam/uui';
import { FlexRow, IconContainer, DropMarker, Text, RichTextView, FlexSpacer, Panel, Badge } from '@epam/promo';
import { CriterionItem, DndCriterion } from './DndCriterion';
import { DndMaterial, MaterialItem } from './DndMaterial';
import { demoText } from './defaultState';
import * as css from './DndSection.scss';
import * as downIcon from '@epam/assets/icons/common/navigation-chevron-down-24.svg';

export interface SectionItem {
    id: number;
    title: string;
    order?: string;
    deadline: string;
    status: string;
    isFolded: boolean;
    criteria: CriterionItem[];
    materials: MaterialItem[];
    kind: 'section';
}

export interface DndSectionProps extends IEditable<SectionItem> {
    nextSection: SectionItem;
    prevSection: SectionItem;
    onMaterialDropFromSection(data: DropParams<MaterialItem, MaterialItem>): void;
}

export class DndSection extends React.Component<DndSectionProps> {
    handleCanAcceptDrop = ({ srcData: { kind } }: DropParams<SectionItem, SectionItem>) => {
        if (kind === 'section') {
            return {
                top: true,
                bottom: true,
            };
        }
    }

    handleOnDrop = ({ srcData, dstData, position }: DropParams<SectionItem, SectionItem>) => {
        let newOrder = position === 'bottom'
                       ? getOrderBetween(dstData.order, this.props.nextSection?.order)
                       : getOrderBetween(this.props.prevSection?.order, dstData.order);

        this.props.onValueChange({ ...srcData, order: newOrder });
    }

    render() {
        const item = this.props.value;
        const sortedCriteria = sortBy(item.criteria, ['order']);
        const sortedMaterials = sortBy(item.materials, ['order']);

        return <DndActor
            srcData={ item }
            dstData={ item }
            canAcceptDrop={ this.handleCanAcceptDrop }
            onDrop={ this.handleOnDrop }
            render={ props => {
                return (
                    <div { ...props.eventHandlers } className={ cx(css.dragElement, props.isDraggedOut && uuiDndState.draggedOut, props.isDropAccepted && uuiDndState.dropAccepted) }>
                        <Panel background='white' cx={ cx(css.dndItem, props.isDragGhost && uuiDndState.dragGhost) } shadow >
                            <FlexRow padding='24' vPadding='12' spacing='18' cx={ css.grabArea } onClick={ () => this.props.onValueChange({ ...item, isFolded: !item.isFolded }) }>
                                <DragHandle cx={ [css.dragHandle] } />
                                <RichTextView><h3>{ item.title }</h3></RichTextView>
                                <FlexSpacer />
                                <FlexRow>
                                    <Text font='sans-semibold'>Deadline:</Text>
                                    <Text color='gray60' >{ item.deadline }</Text>
                                </FlexRow>
                                <Badge fill='semitransparent' size='24' color={ item.status === 'Green' ? 'green' : 'amber' } caption={ `${ item.status } Status` } />
                                <IconContainer  icon={ downIcon } rotate={ item.isFolded ? '180' : '0' } color='gray60' />
                            </FlexRow>
                            { item.isFolded && <>
                                <div className={ css.descriptionSection } >
                                    <Text size='24' lineHeight='24' fontSize='18' font='sans-semibold' >Description</Text>
                                    <RichTextView><p>{ demoText }</p></RichTextView>
                                </div>
                                <div className={ css.criteriaSection }>
                                    <Text size='24' lineHeight='24' fontSize='18' font='sans-semibold' cx={ css.title } >Success Criteria</Text>
                                    { sortedCriteria.map((criterion, index) => <DndCriterion
                                        key={ criterion.id }
                                        value={ criterion }
                                        prevCriterion={ sortedCriteria[index - 1] }
                                        nextCriterion={ sortedCriteria[index + 1] }
                                        onValueChange={ newValue => this.props.onValueChange({ ...item, criteria: item.criteria.map(i => i.id === newValue.id ? newValue : i) })  }
                                    />) }
                                </div>
                                <div className={ css.materialsSection }>
                                    <Text size='24' lineHeight='24' fontSize='18' font='sans-semibold' cx={ css.title } >Materials</Text>
                                    { sortedMaterials.map((material, index) => <DndMaterial
                                        key={ material.id }
                                        value={ material }
                                        prevMaterial={ sortedMaterials[index - 1] }
                                        nextMaterial={ sortedMaterials[index + 1] }
                                        onDropFromSection={ this.props.onMaterialDropFromSection }
                                        onValueChange={ newValue => this.props.onValueChange({ ...item, materials: item.materials.map(i => i.id === newValue.id ? newValue : i) }) }
                                    />) }
                                </div>
                            </> }
                        </Panel>
                        <DropMarker { ...props } />
                    </div>
                );
            } }
        />;
    }
}