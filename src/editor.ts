const tmpNodes: NodeListOf<HTMLParagraphElement> = document.querySelectorAll("p");
const paragraphs: HTMLParagraphElement[] = [];
for(let i = 0; i < tmpNodes.length; ++i){
    paragraphs.push(tmpNodes[i] as HTMLParagraphElement);
}

document.body.addEventListener('click', (e: MouseEvent) => {
    e.preventDefault();
    
    if((e.target as HTMLParagraphElement).tagName === "P")
        return;
    
    const p = getNearestParagraph({ x: e.clientX, y: e.clientY });
    if(!p)
        return;
    p.focus();

    const sel: Selection | null = window.getSelection();
    if(!sel)
        return;

    let range: Range | null = null;
    const pos = document.caretPositionFromPoint(e.clientX, e.clientY);
    if(pos){
        range = document.createRange();
        if(p.textContent === ""){
            range.setStart(p, 0);
        }else{
            range.setStart(pos.offsetNode, pos.offset === 0 ? 0 : pos.offset - 1);
        }
    }
    
    if(!range)
        return;

    sel.removeAllRanges();
    sel.addRange(range);
})

function getNearestParagraph(pos: { x: number, y: number } = { x: 0, y: 0 }): HTMLParagraphElement | null{
    let nearestP: HTMLParagraphElement | null = null;
    let minDistance: number = Infinity;

    paragraphs.forEach((p) => {
        let rect: DOMRect = p.getBoundingClientRect();
        let distance = Math.abs(pos.y - rect.top);
        if(distance < minDistance){
            minDistance = distance;
            nearestP = p;
        }
    })

    return nearestP;
}