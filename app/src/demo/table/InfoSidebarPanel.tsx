import * as React from "react";
import { Badge, EpamAdditionalColor, FlexCell, FlexRow, FlexSpacer, IconButton, Panel, ScrollBars, Text } from "@epam/promo";
import { Person } from "@epam/uui-docs";
import * as css from "./InfoSidebarPanel.scss";
import * as  crossIcon from "@epam/assets/icons/common/navigation-close-24.svg";
import { useEffect, useState } from "react";
import { cx } from "@epam/uui";

interface SidebarPanelProps {
    panelId: number | null;
    data: Person;
    onClose: () => void;
}

export const InfoSidebarPanel: React.FC<SidebarPanelProps> = ({ panelId, data, onClose }) => {
    const [lastData, setLastData] = useState(data);
    
    useEffect(() => {
        if (panelId !== null) setLastData(data);
    }, [panelId]);
    
    const isPanelOpened = panelId !== null;
    const resultData = isPanelOpened ? data : lastData;

    const renderInfoRow = (title: string, value: any) => {
        return <FlexRow padding="24">
            <FlexCell shrink={ 0 } width={ 162 }>
                <Text color="gray60">{ title }</Text>
            </FlexCell>
            <Text cx={ css.noWrap }>
                { value }
            </Text>
        </FlexRow>;
    };

    return (
        <div className={ cx(css.infoSidebarPanelWrapper, isPanelOpened ? "show" : "hide") }>
            <Panel cx={ css.wrapper } background="white">
                <FlexRow borderBottom padding="24">
                    <Text size="48" font="sans-semibold">Detailed Information</Text>
                    <FlexSpacer/>
                    <FlexCell shrink={ 0 } width="auto"><IconButton icon={ crossIcon } onClick={ onClose }/></FlexCell>
                </FlexRow>
                { resultData &&
                <ScrollBars>
                    { renderInfoRow("Name", resultData.name) }
                    { renderInfoRow("Status",
                        <Badge cx={ css.status } caption={ resultData.profileStatus } fill="transparent" color={ resultData.profileStatus.toLowerCase() as EpamAdditionalColor }/>) }
                    { renderInfoRow("Job Title", resultData.jobTitle) }
                    { renderInfoRow("Title Level", resultData.titleLevel) }
                    { renderInfoRow("Office", resultData.officeAddress) }
                    { renderInfoRow("City", resultData.cityName) }
                    { renderInfoRow("Country", resultData.countryName) }
                    { renderInfoRow("Manager", resultData.managerName) }
                    { renderInfoRow("Hire date", new Date(resultData.hireDate).toLocaleDateString()) }
                    { renderInfoRow("Related NPR", resultData.relatedNPR ? "Completed" : "Uncompleted") }
                    { renderInfoRow("Department", resultData.departmentName) }
                    { renderInfoRow("Email", resultData.email) }
                    { renderInfoRow("Modified", new Date(resultData.modifiedDate).toLocaleDateString()) }
                    { renderInfoRow("Notes", resultData.notes || "-") }
                    { renderInfoRow("Primary skill", resultData.primarySkill) }
                    { renderInfoRow("Production category", resultData.productionCategory) }
                    { renderInfoRow("UID", resultData.uid) }
                    { renderInfoRow("Birth date", new Date(resultData.birthDate).toLocaleDateString()) }
                </ScrollBars>
                }
            </Panel>
        </div>
    );
};
