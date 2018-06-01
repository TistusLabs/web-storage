import { Component, OnInit } from '@angular/core';
import { User } from '../../data/user';
import { MyContentService } from  '../services/mycontent.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['topbar.component.scss']
})
export class TopbarComponent implements OnInit {
    user : User = {
        name : 'Username',
        type : 'admin'
    };
    constructor(public myContentService: MyContentService) {
    }

    ngOnInit() {
    }

    addNewFolder = function () {
        this.myContentService.addNewFolder();
    };

    addNewFile = function () {
        this.myContentService.addNewFile();
    }

}
