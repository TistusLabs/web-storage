import { Component, OnInit } from '@angular/core';
import { User } from '../../assets/data/user';
import { MyContentService } from  '../services/mycontent.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['topbar.component.scss']
})
export class TopbarComponent implements OnInit {
    user : User = {
        name : 'Username',
        type : 'admin',
        username : null,
        password : null
    };
    constructor(public myContentService: MyContentService) {
    }

    ngOnInit() {
    }

    newFolderData = {
        name : ""
    };

    addNewFolder = function () {
        this.myContentService.addNewFolder(this.newFolderData);
        this.newFolderData.name = "";
    };

    addNewFile = function () {
        this.myContentService.addNewFile();
    }

}
