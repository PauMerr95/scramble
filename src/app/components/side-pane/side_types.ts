export type Avatar = "Bird" | "Duck" | "Earth" | "Falling" | "Sheep" | "Squirrel";
export type SelectableLocation = 
    "ProfileAvatar" | "ProfileName" | "ProfileBio" |
    "FileItem" |
    "QueryGenome" | "QueryGene" | "QueryProkaryot" | "QueryVirus" | "QueryOrganelle";
export type MoveGrid = SelectableLocation[][];
export type ExpPoint = number;
export type ExpPerc = number;