import { Component, OnInit } from '@angular/core';
import { ContentItems } from '../../assets/data/content';

@Component({
    selector: 'app-body',
    templateUrl: './body.component.html',
    styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit {
    constructor() { }

    ngOnInit() {
    }

    content = ContentItems;
    layout = 'carded';
    isContentItemFull = false;
    fullViewPos = '';
    selectedContentItem = {};

    changeContentLayout = function (layout) {
        this.layout = layout;
    };

    openContentItem = function (itemid, e) {
        if(e.target.className.split(' ')[0] != 'ws-content-more-ops') {
            this.isContentItemFull = true;
            for(var i=0;i < this.content.length;i++){
                if(this.content[i].id == itemid)
                    this.selectedContentItem = this.content[i];
            }
            // this.fullViewPos = 'width:100%;height:100%';
        }
    };

    closeContentFull = function () {
        this.isContentItemFull = false;
    };

}
