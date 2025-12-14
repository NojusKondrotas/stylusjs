import { TagFormat } from "../formats/abstractions/tag-format";
import { CSSFormat } from "../formats/abstractions/css-format";
import { Blockquote } from "../formats/blockquote.js";
import { Bold } from "../formats/bold.js";
import { Code } from "../formats/code.js";
import { Color } from "../formats/color.js";
import { Header } from "../formats/header.js";
import { Italic } from "../formats/italic.js";
import { Strike } from "../formats/strike.js";
import { Underline } from "../formats/underline.js";

export function formatSelection(format: TagFormat){
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