import { TagFormat } from "./tag-format.js";

export abstract class CSSFormat extends TagFormat {
    abstract propertyName: string;
    abstract propertyValue: string;
}