import { Component, OnInit } from '@angular/core';
import { User } from '../../assets/data/user';
import { MyContentService } from '../services/mycontent.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['topbar.component.scss']
})
export class TopbarComponent implements OnInit {
    user: User = {
        name: 'Username',
        type: 'admin',
        username: null,
        password: null
    };
    constructor(public myContentService: MyContentService) {
    }

    ngOnInit() {
    }

    newFolderData = {
        name: ""
    };

    newFileData = {
        filename: "",
        upfile: {}
    };

    addNewFolder = function () {
        // this.myContentService.addNewFolder(this.newFolderData);
        // this.newFolderData.name = "";

        this.myContentService.addNewFolder(this.newFolderData)
            .subscribe(newFolderinfo => {
                this.newFolderData.name = "";
                //$("#initNewFolder").modal('hide');
            });
    };

    setFile = function (event) {
        //debugger
        this.newFileData.upfile = event.target.files[0]
    }

    addNewFile = function () {
        //this.myContentService.addNewFile();

        debugger
        const uploadData = new FormData();
        uploadData.append('filename', this.newFileData.filename);
        uploadData.append('upfile', this.newFileData.upfile);
        uploadData.append('folderName', this.myContentService.getCurrenFolder());
        uploadData.append('userId', "1");

        // this.newFileDetails.filename = filedata.filename;
        // this.newFileDetails.folderName = this.getCurrenFolder(); // get from service
        // this.newFileDetails.userId = this._userID;
        // this.newFileDetails.upfile = filedata.upfile;
        debugger
        this.myContentService.addNewFile(uploadData)
            .subscribe(event => {
                console.log(event);
                this.newFileData.filename = "";
                this.newFileData.upfile = {};
                //$("#initNewFile").modal('hide');
            });
    }

}
