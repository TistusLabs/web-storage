import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable()
export class UIHelperService {
    constructor() { }
    @Output() itemsLayoutEmitter: EventEmitter<string> = new EventEmitter();
    
    /* Items Layout =========================*/
    itemsLayout = 'grid';
    toggleItemsLayout(l) {
        this.itemsLayout = l;
        this.itemsLayoutEmitter.emit(this.itemsLayout);
    }
    /* --------------------------------------*/


}
