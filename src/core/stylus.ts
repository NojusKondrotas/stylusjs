import { FormatStructure } from "../formats/format-structure";
import { formatSelection } from "./format";

export let chosenStylusOptions: StylusOptions;
export let chosenToolbarPrototype: StylusToolbarInteractions;

type EventListeners = Record<string, EventListenerOrEventListenerObject>;

export class StylusToolbarInteractionNode {
    formatter: FormatStructure;
    eventListeners: EventListeners = {};
    parentToolbar: StylusToolbarInteractions;

    constructor(formatter: FormatStructure, p: StylusToolbarInteractions) {
        this.formatter = formatter;
        this.parentToolbar = p;
    }

    addListeners(listeners: EventListeners) {
        this.eventListeners = { ...this.eventListeners, ...listeners };
    }

    applyListenersToDOM(domElement: HTMLElement) {
        Object.entries(this.eventListeners).forEach(([eventType, handler]) => {
            domElement.addEventListener(eventType, handler);
        });
    }

    removeListeners(listeners: EventListeners) {
        Object.entries(listeners).forEach(([eventType, handler]) => {
            if (this.eventListeners.hasOwnProperty(eventType)
            && this.eventListeners[eventType] === handler) {
                delete this.eventListeners[eventType];
            }
        });
    }

    removeListenersFromDOM(domElement: HTMLElement) {
        Object.entries(this.eventListeners).forEach(([eventType, handler]) => {
            domElement.removeEventListener(eventType, handler);
        });
    }
}

export class StylusToolbarInteractions {
    formatterNodes: StylusToolbarInteractionNode[] = [];
    domTarget: HTMLElement | null;

    constructor(interactions: StylusToolbarInteractionNode[]) {
        this.formatterNodes = interactions;
        this.domTarget = null;
    }

    get(idx: number): StylusToolbarInteractionNode | null {
        return this.formatterNodes[idx] ?? null;
    }

    set(idx: number, interaction: StylusToolbarInteractionNode): void {
        if (this.formatterNodes.length > idx) {
            this.formatterNodes[idx] = interaction
        }
    }

    append(interaction: StylusToolbarInteractionNode) {
        this.formatterNodes.push(interaction);
    }

    update(interaction: StylusToolbarInteractionNode) {
        const idxToReplace = this.formatterNodes.findIndex(
            node => node.formatter === interaction.formatter
        )
        
        if (idxToReplace !== -1) {
            this.formatterNodes[idxToReplace] = interaction;
        } else {
            this.append(interaction);
        }
    }

    format(formmater: FormatStructure) {
        formatSelection(formmater);
    }
}

interface StylusOptionsI {
    contentClass: string;
    toolbarClass: string;
    isSingleToolbar: boolean;
    toolbarPosition: string;
    fixedToolbarSide: 'top' | 'right' | 'bottom' | 'left' | 'any';
    toolbarOffset: { x: number, y: number };
}

class StylusOptions implements StylusOptionsI {
    contentClass = "";
    toolbarClass = "";
    isSingleToolbar = false;
    toolbarPosition = 'initial';
    fixedToolbarSide: 'top' | 'right' | 'bottom' | 'left' | 'any' = 'any';
    toolbarOffset = { x: 0, y: 0 };

    constructor(options: StylusOptionsI){
        Object.assign(this, options);
    }

    update(options: Partial<StylusOptionsI>){
        Object.assign(this, options);
    }
}

function initStylus(options: StylusOptionsI){
    chosenStylusOptions = new StylusOptions(options);
}

function updateStylusOptions(options: Partial<StylusOptionsI>){
    chosenStylusOptions.update(options);
}

function initToolbarPrototype(interactions: StylusToolbarInteractionNode[]) {
    chosenToolbarPrototype = new StylusToolbarInteractions(interactions);
}