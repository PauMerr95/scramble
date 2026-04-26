export type sequence = string;
export type rows = string[];
export type EditorMode = "Normal" | "Visual" | "Insert" | "Replace";
export type RGB = `rgb(${number}, ${number}, ${number})`
export type RGBA = `rgb(${number}, ${number}, ${number}, ${number})`
export type HEX = `#${string}`
export type Color = RGB | RGBA | HEX;

export interface CursorPos {
    row: number;
    col: number;
    offset: number;
}
export interface VisualSelection {
    anchorOffset: number;
    activeOffset: number;
}
export interface FastaRecord {
    header: string;
    comments: string[];
    sequence: sequence;
}
