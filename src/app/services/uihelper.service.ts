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

    formatBytes(a, b) {
        if (0 === a) { return '0 Bytes'; }
        const c = 1024,
            d = b || 2,
            e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            f = Math.floor(Math.log(a) / Math.log(c));
        return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f];
    }
}
