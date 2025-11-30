import {FormatStructure} from "../formats/format-structure.js";

export function formatSelection(format: FormatStructure){
    const sel: Selection | null = window.getSelection();
    if(!sel || sel.rangeCount === 0)
        return;

    let range = sel.getRangeAt(0);
    const formatWrapper = document.createElement(format.elementName);
    formatWrapper.appendChild(range.extractContents());
    range.insertNode(formatWrapper);

    sel.removeAllRanges();
    range = document.createRange();
    range.setStartAfter(formatWrapper);
    range.collapse(true);
    sel.addRange(range);
}