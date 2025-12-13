import { chosenStylusOptions } from "./stylus";

let stylusTargets: HTMLElement[] = [];

function initEditor() {
    const tmpNodes: HTMLCollectionOf<Element> = document.getElementsByClassName(chosenStylusOptions.contentClass);
    for(let i = 0; i < tmpNodes.length; ++i){
        stylusTargets.push(tmpNodes[i] as HTMLElement);
    }
}

function focusTarget(coordinates: { x: number, y: number }){
    const t = getNearestTarget(coordinates);
    if(!t)
        return;
    t.focus();

    const sel: Selection | null = window.getSelection();
    if(!sel)
        return;

    let range: Range | null = null;
    const pos = document.caretPositionFromPoint(coordinates.x, coordinates.y);
    if(pos){
        range = document.createRange();
        if(t.textContent === ""){
            range.setStart(t, 0);
        }else{
            range.setStart(pos.offsetNode, pos.offset);
        }
    }
    
    if(!range)
        return;

    sel.removeAllRanges();
    sel.addRange(range);
}

document.body.addEventListener('click', (e: MouseEvent) => {
    e.preventDefault();
    
    if((e.target as HTMLElement).classList.contains(chosenStylusOptions.contentClass))
        return;
    
    focusTarget({ x: e.clientX, y: e.clientY });
})

function getNearestTarget(pos: { x: number, y: number } = { x: 0, y: 0 }): HTMLElement | null{
    let nearestT: HTMLElement | null = null;
    let minDistance: number = Infinity;

    stylusTargets.forEach((t) => {
        let rect: DOMRect = t.getBoundingClientRect();
        let distance = Math.abs(pos.y - rect.top);
        if(distance < minDistance){
            minDistance = distance;
            nearestT = t;
        }
    })

    return nearestT;
}