import { Route } from "@angular/router";

export type NavbarLocation = "Profile" | "Files" | "Query" | "Hidden";
export type FocusLocation = "MainPane" | "Navbar" | "SidePane" | "CmdLine" | "Modal";
export type QueryPage = "Genome" | "Gene" | "Prokaryot" | "Virus" | "Organelle" | "QueryMain";
export type Theme = "DarkLime" | "Ocean";

export type NotificationType = "Info" | "Warn" | "Error" | "Success";
export interface NotificationObject {
    kind: NotificationType,
    message: string
}
export type ActiveNotification = NotificationObject & { id: number };
export interface ModalObject {
    title: string,
    route: string
}