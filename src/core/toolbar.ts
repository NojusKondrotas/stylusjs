import { chosenStylusOptions, chosenToolbarPrototype, StylusToolbarInteractionNode, StylusToolbarInteractions } from "./stylus";

export let instantiatedToolbars = new Set();

function initToolbar(target: HTMLElement, coords?: { left: number, top: number }) {
    const toolbarObj: StylusToolbarInteractions = new StylusToolbarInteractions([]);
    instantiatedToolbars.add(toolbarObj);

    const toolbarContainer = document.createElement('div');
    toolbarContainer.classList.add(chosenStylusOptions.toolbarClass);
    toolbarContainer.style.position = chosenStylusOptions.toolbarPosition;
    if (coords) {
        toolbarContainer.style.left = (coords.left + chosenStylusOptions.toolbarOffset.x) + 'px';
        toolbarContainer.style.top = (coords.top + chosenStylusOptions.toolbarOffset.y) + 'px';
    } else {
        toolbarContainer.style.left = chosenStylusOptions.toolbarOffset.x + 'px';
        toolbarContainer.style.top = chosenStylusOptions.toolbarOffset.y + 'px';
    }
    switch (chosenStylusOptions.fixedToolbarSide) {
        case 'top':
            toolbarContainer.style.top = '0';
            break;
        case 'right':
            toolbarContainer.style.right = '0';
            break;
        case 'bottom':
            toolbarContainer.style.bottom = '0';
            break;
        case 'left':
            toolbarContainer.style.left = '0';
            break;
    }

    chosenToolbarPrototype.formatterNodes.forEach(node => {
        toolbarContainer.appendChild(initToolbarBtn(node, toolbarObj));
    });

    return toolbarContainer;
}

function initToolbarBtn(interaction: StylusToolbarInteractionNode,
    parentToolbar: StylusToolbarInteractions) {
    const btn = document.createElement('button');
    btn.classList.add(chosenStylusOptions.toolbarClass + '-btn');

    Object.entries(interaction.eventListeners).forEach(([eventType, handler]) => {
        btn.addEventListener(eventType, handler);
    });

    interaction.parentToolbar = parentToolbar;
    return btn;
}