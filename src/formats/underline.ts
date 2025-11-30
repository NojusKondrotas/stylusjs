import { FormatStructure } from './format-structure.js';

export class Underline extends FormatStructure {
    formatName = 'underline';
    elementName = 'u';

    static override FORMAT_NAME = 'underline';
}