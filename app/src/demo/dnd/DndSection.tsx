import * as React from 'react';
import { DragHandle } from '@epam/uui-components';
import {
    DndActor, IEditable, cx, uuiDndState, DropParams, getOrderBetween, orderBy,
} from '@epam/uui-core';
import {
    FlexRow, IconContainer, DropMarker, Text, RichTextView, FlexSpacer, Panel, Badge, FlexCell,
} from '@epam/uui';
import { CriterionItem, DndCriterion } from './DndCriterion';
import { DndMaterial, MaterialItem } from './DndMaterial';
import css from './DndSection.module.scss';
import { ReactComponent as DownIcon } from '@epam/assets/icons/common/navigation-chevron-down-24.svg';

const demoText = 'So you have your new digital camera and clicking away to glory anything and\n'
    + ' everything in sight. Now you want to print them and you need the best photo printers to\n'
    + ' print your fantastic photos. Let us talk about the various printers in the market and some\n'
    + ' tips on choosing the best photo printers. Most of the printers could easily be purchased\n'
    + ' under $500. While all of them have similar features, it is better to be aware of certain\n'
    + ' key features that determines their price and print quality. First to look out for is the\n'
    + ' printing width. It differs among printers. Normally they are available with a width of\n'
    + ' either 8.5 inches or 13 inches. A 6 color printer is adequate but if you want good black\n'
    + ' and white images as well it is better to go for 8-color printer.';

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
    };

    handleOnDrop = ({ srcData, dstData, position }: DropParams<SectionItem, SectionItem>) => {
        const newOrder = position === 'bottom' ? getOrderBetween(dstData.order, this.props.nextSection?.order) : getOrderBetween(this.props.prevSection?.order, dstData.order);

        this.props.onValueChange({ ...srcData, order: newOrder });
    };

    render() {
        const item = this.props.value;
        const sortedCriteria = orderBy(item.criteria, ({ order }) => order);
        const sortedMaterials = orderBy(item.materials, ({ order }) => order);

        return (
            <DndActor
                key={ item.id }
                srcData={ item }
                dstData={ item }
                canAcceptDrop={ this.handleCanAcceptDrop }
                onDrop={ this.handleOnDrop }
                render={ (props) => (
                    <div
                        ref={ props.ref }
                        onPointerEnter={ props.eventHandlers.onPointerEnter }
                        onPointerMove={ props.eventHandlers.onPointerMove }
                        onPointerLeave={ props.eventHandlers.onPointerLeave }
                        onPointerUp={ props.eventHandlers.onPointerUp }
                        className={ cx(css.dragElement, props.classNames) }
                    >
                        <Panel background="surface-main" cx={ cx(css.dndItem, props.isDragGhost && uuiDndState.dragGhost) } shadow>
                            <FlexRow
                                padding="24"
                                vPadding="12"
                                cx={ css.grabArea }
                            >
                                <DragHandle
                                    cx={ [css.dragHandle] }
                                    rawProps={ {
                                        onTouchStart: props.eventHandlers.onTouchStart,
                                        onPointerDown: props.eventHandlers.onPointerDown,
                                    } }
                                />
                                <FlexCell grow={ 1 }>
                                    <FlexRow columnGap="18" cx={ [css.clickArea] } onClick={ () => this.props.onValueChange({ ...item, isFolded: !item.isFolded }) }>
                                        <RichTextView cx={ [css.itemTitle] }>
                                            <h3 style={ { margin: '20px 0' } }>{ item.title }</h3>
                                        </RichTextView>
                                        <FlexSpacer />
                                        <FlexRow>
                                            <Text fontWeight="600">Deadline:</Text>
                                            <Text color="secondary">{ item.deadline }</Text>
                                        </FlexRow>
                                        <Badge fill="outline" size="24" color={ item.status === 'Green' ? 'success' : 'warning' } caption={ `${item.status} Status` } />
                                        <IconContainer icon={ DownIcon } rotate={ item.isFolded ? '180' : '0' } cx={ css.iconGray60 } />
                                    </FlexRow>
                                </FlexCell>
                            </FlexRow>
                            { item.isFolded && (
                                <>
                                    <div className={ css.descriptionSection }>
                                        <Text size="24" lineHeight="24" fontSize="18" fontWeight="600">
                                            Description
                                        </Text>
                                        <RichTextView>
                                            <p>{ demoText }</p>
                                        </RichTextView>
                                    </div>
                                    <div className={ css.criteriaSection }>
                                        <Text size="24" lineHeight="24" fontSize="18" fontWeight="600" cx={ css.title }>
                                            Success Criteria
                                        </Text>
                                        { sortedCriteria.map((criterion, index) => (
                                            <DndCriterion
                                                key={ criterion.id }
                                                value={ criterion }
                                                prevCriterion={ sortedCriteria[index - 1] }
                                                nextCriterion={ sortedCriteria[index + 1] }
                                                onValueChange={ (newValue) =>
                                                    this.props.onValueChange({ ...item, criteria: item.criteria.map((i) => (i.id === newValue.id ? newValue : i)) }) }
                                            />
                                        )) }
                                    </div>
                                    <div className={ css.materialsSection }>
                                        <Text size="24" lineHeight="24" fontSize="18" fontWeight="600" cx={ css.title }>
                                            Materials
                                        </Text>
                                        { sortedMaterials.map((material, index) => (
                                            <DndMaterial
                                                key={ material.id }
                                                value={ material }
                                                prevMaterial={ sortedMaterials[index - 1] }
                                                nextMaterial={ sortedMaterials[index + 1] }
                                                onDropFromSection={ this.props.onMaterialDropFromSection }
                                                onValueChange={ (newValue) =>
                                                    this.props.onValueChange({ ...item, materials: item.materials.map((i) => (i.id === newValue.id ? newValue : i)) }) }
                                            />
                                        )) }
                                    </div>
                                </>
                            ) }
                        </Panel>
                        <DropMarker { ...props } />
                    </div>
                ) }
            />
        );
    }
}
