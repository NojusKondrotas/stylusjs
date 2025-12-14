import * as Editor from "./editor.js";
import * as Toolbar from "./toolbar.js";
import { TagFormat } from "../formats/abstractions/tag-format.js";
import { formatSelection } from "./format.js";

export class StylusConfiguration {
    static StylusOptions: StylusOptions;
    static ToolbarPrototype: StylusToolbarInteractions;
    static ToolbarInteractorClickEvent: Record<string, EventListenerOrEventListenerObject> = {
        click: function(this: StylusToolbarInteractionNode, e: Event) {
            this.parentToolbar.format(this.formatter);
        }
    }
}

type EventListeners = Record<string, EventListenerOrEventListenerObject>;

export class StylusToolbarInteractionNode {
    formatter: TagFormat;
    eventListeners: EventListeners = {};
    parentToolbar: StylusToolbarInteractions;

    constructor(formatter: TagFormat, p: StylusToolbarInteractions) {
        this.formatter = formatter;
        this.parentToolbar = p;
    }

    addDefaultListener() {
        this.eventListeners = { ...this.eventListeners, ...StylusConfiguration.ToolbarInteractorClickEvent };
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

    format(formmater: TagFormat) {
        formatSelection(formmater);
    }
}

interface StylusOptionsI {
    contentClass: string;
    toolbarClass: string;
    toolbarPosition: string;
    fixedToolbarSide: 'top' | 'right' | 'bottom' | 'left' | 'any';
    toolbarOffset: { x: number, y: number };
}

class StylusOptions implements StylusOptionsI {
    contentClass = "";
    toolbarClass = "";
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
    StylusConfiguration.StylusOptions = new StylusOptions(options);
}

function updateStylusOptions(options: Partial<StylusOptionsI>){
    StylusConfiguration.StylusOptions.update(options);
}

function initToolbarPrototype(interactions: StylusToolbarInteractionNode[]) {
    StylusConfiguration.ToolbarPrototype = new StylusToolbarInteractions(interactions);
}