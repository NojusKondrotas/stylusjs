import { FormatStructure } from "format-structure";

export abstract class TagFormat extends FormatStructure {
    abstract elementName: string;
}