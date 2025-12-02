import { FormatStructure } from "./format-structure";

export class Header extends FormatStructure{
    formatName = 'header';
    elementName = 'h0';
    
    static override FORMAT_NAME = 'header'
    static override ELEMENT_NAME = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
}