export const buttonIDs = [
    "TestButton1",

    // === Query Buttons ===
    "RetrieveGenomeBtn", "RetrieveGeneBtn", "RetrieveProkaryotBtn",
    "RetrieveVirusBtn", "RetrieveOrganelleBtn", 
    // === Profile Buttons ===
    "ProfileBtnSave"
];
export const dropDownIDs = [
    // === Profile DDs ===
    "ProfileDDThemes", 
];

export type ButtonID = typeof buttonIDs[number];
export type DropDownID = typeof buttonIDs[number];