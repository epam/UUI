import React, { useState } from 'react';
import { Dropdown } from '@epam/uui-components';
import { offset } from '@floating-ui/react';
import { IDropdownToggler, DropdownBodyProps } from '@epam/uui-core';
import { LinkButton, Text, FlexRow, DropdownContainer, Tag, Panel, CheckboxGroup, RadioGroup, FlexCell } from '@epam/uui';

const categories = [
    { id: 1, name: 'Design' },
    { id: 2, name: 'Development' },
    { id: 3, name: 'Marketing' },
    { id: 4, name: 'Sales' },
    { id: 5, name: 'Support' },
    { id: 6, name: 'HR' },
];

export default function FixedBodyPositionExample() {
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [fixedBodyPosition, setFixedBodyPosition] = useState(false);

    const renderDropdownBody = (props: DropdownBodyProps) => {
        return (
            <DropdownContainer showArrow={ true } vPadding="12" padding="12" { ...props }>
                <Panel background="surface-main">
                    <Text fontSize="14" lineHeight="24" color="primary" fontWeight="600" cx={ { marginBottom: '12px' } }>
                        Select categories:
                    </Text>
                    <CheckboxGroup
                        items={ categories.map((cat) => ({ id: cat.id, name: cat.name })) }
                        value={ selectedCategories }
                        onValueChange={ setSelectedCategories }
                        direction="vertical"
                    />
                </Panel>
            </DropdownContainer>
        );
    };

    const renderTarget = (props: IDropdownToggler) => {
        return (
            <LinkButton
                { ...props }
                caption={
                    selectedCategories.length > 0
                        ? `Selected: ${selectedCategories.length}`
                        : 'Select categories'
                }
            />
        );
    };

    return (
        <FlexRow columnGap="24" alignItems="center">
            <FlexCell width="auto">
                <FlexRow columnGap="12" vPadding="12">
                    <Text fontSize="14" lineHeight="24" color="primary" fontWeight="600">
                        fixedBodyPosition:
                    </Text>
                    <RadioGroup
                        name="fixedBodyPosition"
                        items={ [
                            { id: true, name: 'true' },
                            { id: false, name: 'false' },
                        ] }
                        value={ fixedBodyPosition }
                        onValueChange={ setFixedBodyPosition }
                        direction="vertical"
                    />
                </FlexRow>
            </FlexCell>
            <FlexCell width="auto">
                <FlexRow alignItems="center" columnGap="6">
                    {selectedCategories.length > 0 && (
                        <>
                            {selectedCategories.map((categoryId) => {
                                const category = categories.find((c) => c.id === categoryId);
                                return category ? (
                                    <Tag
                                        key={ categoryId }
                                        caption={ category.name }
                                        size="24"
                                        fill="solid"
                                        color="info"
                                        onClear={ (e) => {
                                            e.stopPropagation();
                                            setSelectedCategories((prev) => prev.filter((id) => id !== categoryId));
                                        } }
                                    />
                                ) : null;
                            })}
                        </>
                    )}
                    <Dropdown
                        renderBody={ (props) => renderDropdownBody(props) }
                        renderTarget={ (props) => renderTarget(props) }
                        placement="bottom-start"
                        fixedBodyPosition={ fixedBodyPosition }
                        middleware={ [offset(6)] }
                    />
                </FlexRow>
            </FlexCell>
        </FlexRow>
    );
}
