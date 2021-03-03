import React, {useState} from "react";
import {ArrayDataSource} from "@epam/uui";
import {RadioGroup} from "@epam/promo";
import {columns} from "../../data";

const Grouping: React.FC = () => {
    const [value, setValue] = useState(null);

    // const groupings = React.useMemo(() => [
    //     {id: "none", name: "None"},
    //     {id: "profileStatus", name: "Profile Status"},
    //     {id: "title", name: "Title"},
    //     {id: "office", name: "Office"},
    //     {id: "manager", name: "Manager"},
    //     {id: "country", name: "Country"},
    //     {id: "city", name: "City"},
    //     {id: "profileType", name: "Profile Type"},
    //     {id: "jobTitle", name: "Job Title"},
    //     {id: "department", name: "Department"},
    // ], []);

    // const groupingDataSource = React.useMemo(() => new ArrayDataSource({items: groupings}), [groupings]);

    return (
        <RadioGroup value={ value } onValueChange={ setValue } items={ columns }/>
    );
};

export default React.memo(Grouping);