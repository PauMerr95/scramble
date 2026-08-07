import { ButtonID, DropDownID, InputID } from "./util_types";
export const avatars = ["Bird", "Duck", "Earth", "Falling", "Sheep", "Squirrel"]
export type Avatar = typeof avatars[number];

export const selectableLocations: string[] = [
    // -- PROFILE --
    "ProfileAvatar", "ProfileName", "ProfileBio", "ProfileKey", "ProfilePath",
    // -- FILES --
    "FileItem",
    // -- QUERY --
    "IconQueryGenome", "IconQueryGene", "IconQueryProkaryot", "IconQueryVirus", "IconQueryOrganelle",
]
export type SelectableLocation = typeof selectableLocations[number] | Avatar | ButtonID | DropDownID | InputID;

export type MoveGrid = SelectableLocation[][];

