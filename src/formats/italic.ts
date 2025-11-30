import {FormatStructure} from './format-structure.js';

export class Italic extends FormatStructure {
    formatName = 'italic';
    elementName = 'em';

    static override FORMAT_NAME = 'italic';
}