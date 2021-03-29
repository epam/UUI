export * from "./api";
export * from "./filters";

export const items = [
    {id: "id1", name: "name1"},
    {id: "id2", name: "name2"},
    {id: "id3", name: "name3"},
];

export const presets = [
    {
        id: "default",
        name: "Default",
        isActive: true,
    },
    {
        id: "newPreset",
        name: "New Preset",
        isActive: false,
    },
    {
        id: "greenStatus",
        name: "Green Status",
        isActive: false,
    },
    {
        id: "groupByTitle",
        name: "Group By Title",
        isActive: false,
    },
];