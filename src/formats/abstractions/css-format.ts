import { FormatStructure } from "format-structure";

export abstract class CSSFormat extends FormatStructure {
    abstract propertyName: string;
    abstract propertyValue: string;
}