import { Theme } from "./layout_types";

export const buttonIDs = [
    "TestButton1",

    // === Query Buttons ===
    "RetrieveGenomeBtn", "RetrieveGeneBtn", "RetrieveProkaryotBtn",
    "RetrieveVirusBtn", "RetrieveOrganelleBtn",
    // === Profile Buttons ===
    "ProfileBtnSave"
] as const;
export const dropDownIDs = [
    // === Profile DDs ===
    "ProfileDDThemes",
] as const;

export type ButtonID = typeof buttonIDs[number];
export type DropDownID = typeof dropDownIDs[number];

export type DropDownOption = Theme;

