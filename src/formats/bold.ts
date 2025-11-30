import { FormatStructure } from './format-structure.js';

export class Bold extends FormatStructure {
    formatName = 'bold';
    elementName = 'strong';

    static override FORMAT_NAME = 'bold';
}