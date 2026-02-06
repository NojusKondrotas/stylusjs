import { TagFormat } from "../formats/abstractions/tag-format.js";
import { CSSFormat } from "../formats/abstractions/css-format.js";
import { Blockquote } from "../formats/blockquote.js";
import { Bold } from "../formats/bold.js";
import { Code } from "../formats/code.js";
import { Color } from "../formats/color.js";
import { Header } from "../formats/header.js";
import { Italic } from "../formats/italic.js";
import { Strike } from "../formats/strike.js";
import { Underline } from "../formats/underline.js";

function hasAncestor(node: Node | null, tagName: string): HTMLElement | null {
    tagName = tagName.toUpperCase();

    while(node) {
        if(node instanceof HTMLElement && node.tagName === tagName) {
            return node;
        }
        node = node.parentNode;
    }

    return null;
}

function surroundingTags(range: Range, tagName: string): { startTag: HTMLElement | null, endTag: HTMLElement | null } {
    let startTag = hasAncestor(range.startContainer, tagName);
    let endTag = hasAncestor(range.endContainer, tagName);

    return { startTag, endTag };
}

function applyFormating(tags: { startTag: HTMLElement | null, endTag: HTMLElement | null }, selection: Selection, format: TagFormat) {
    const { startTag, endTag } = tags;
    let range = selection.getRangeAt(0);
    const formatWrapper = document.createElement(format.elementName);

    if(startTag) {
        if(endTag) {
            // remove formatting
        } else {
            const newRange = document.createRange();
            newRange.setStartAfter(startTag);
            newRange.setEnd(range.endContainer, range.endOffset);

            const extracted = newRange.extractContents();
            formatWrapper.appendChild(extracted);
            newRange.insertNode(formatWrapper);
        }
    } else if(endTag) {
        const newRange = document.createRange();
        newRange.setStart(range.startContainer, range.startOffset);
        newRange.setEndBefore(endTag);

        const extracted = newRange.extractContents();
        formatWrapper.appendChild(extracted);
        newRange.insertNode(formatWrapper);
    } else {
        formatWrapper.appendChild(range.extractContents());
        range.insertNode(formatWrapper);
    }

    selection.removeAllRanges();
    range = document.createRange();
    range.setStartAfter(formatWrapper);
    range.collapse(true);
    selection.addRange(range);
}

export function formatSelection(format: TagFormat){
    const sel: Selection | null = window.getSelection();
    if(!sel || sel.rangeCount === 0)
        return;

    let range = sel.getRangeAt(0);
    applyFormating(surroundingTags(range, Bold.elementName), sel, format);
}