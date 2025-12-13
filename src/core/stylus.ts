import { FormatStructure } from "../formats/format-structure";

let chosenStylusOptions: StylusOptions;
let chosenToolbarPrototype: StylusToolbarInteractions;

type EventListeners = Record<string, EventListenerOrEventListenerObject>;

class StylusToolbarInteractionNode {
    formatter: FormatStructure;
    domElement: HTMLElement;
    activeListeners: EventListeners = {};

    constructor(formatter: FormatStructure, domElement: HTMLElement) {
        this.formatter = formatter;
        this.domElement = domElement;
    }

    addListeners(listeners: EventListeners) {
        this.activeListeners = { ...this.activeListeners, ...listeners };
        Object.entries(listeners).forEach(([eventType, handler]) => {
            this.domElement.addEventListener(eventType, handler);
        });
    }

    removeListeners(listeners: EventListeners) {
        Object.entries(listeners).forEach(([eventType, handler]) => {
            this.domElement.removeEventListener(eventType, handler);
            if (this.activeListeners.hasOwnProperty(eventType)
            && this.activeListeners[eventType] === handler) {
                delete this.activeListeners[eventType];
            }
        });
    }
}

class StylusToolbarInteractions {
    formatterNodes: StylusToolbarInteractionNode[] = [];

    constructor(interactions: StylusToolbarInteractionNode[]) {
        this.formatterNodes = interactions;
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
}

interface StylusOptionsI {
    contentClass: string;
    toolbarClass: string;
    isSingleToolbar: boolean;
    isToolbarFixed: boolean;
    fixedToolbarSide: 'up' | 'right' | 'down' | 'left' | null;
    toolbarOffset: { x: number, y: number };
}

class StylusOptions implements StylusOptionsI {
    contentClass: string = "";
    toolbarClass: string = "";
    isSingleToolbar: boolean = false;
    isToolbarFixed: boolean = false;
    fixedToolbarSide: 'up' | 'right' | 'down' | 'left' | null = null;
    toolbarOffset: { x: number, y: number } = { x: 0, y: 0 };

    constructor(options: StylusOptionsI){
        Object.assign(this, options);
    }

    update(options: Partial<StylusOptionsI>){
        Object.assign(this, options);
    }
}

function initStylus(options: StylusOptionsI){
    chosenStylusOptions = new StylusOptions(options)
}

function updateStylusOptions(options: StylusOptionsI){
    chosenStylusOptions.update(options);
}

function initToolbarPrototype(interactions: StylusToolbarInteractionNode[]) {
    chosenToolbarPrototype = new StylusToolbarInteractions(interactions);
}