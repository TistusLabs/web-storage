import { Component, OnInit } from '@angular/core';
import { User } from '../../assets/data/user';
import { MyContentService } from '../services/mycontent.service';
import { AuthService } from '../services/auth.service';
import { Router, NavigationExtras } from '@angular/router';
import { UIHelperService } from '../services/uihelper.service';

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
    constructor(
        public myContentService: MyContentService,
        private authService: AuthService,
        private router: Router,
        public uiHelperService: UIHelperService ) {
    }
    itemsLayout = 'grid';
    ngOnInit() {
        this.uiHelperService.itemsLayoutEmitter.subscribe(il => {
            this.itemsLayout = il;
        });
    }

    newFolderData = {
        name: ""
    };

    newFileData = {
        filename: "",
        upfile: {}
    };

    // Update items layout
    toggleItemsLayout(l) {
        this.uiHelperService.toggleItemsLayout(l);
    }

    goToRoute = function (route) {
        //debugger
        let navigationExtras: NavigationExtras = {
            queryParams: { 'page': route }
        };
        this.router.navigate(['ws/dashboard'], navigationExtras);
    }

    addNewFolder = function () {
        // this.myContentService.addNewFolder(this.newFolderData);
        // this.newFolderData.name = "";

        this.myContentService.addNewFolder(this.newFolderData)
            .subscribe(newFolderinfo => {
                this.newFolderData.name = "";
                $("#initNewFolder").modal('hide');
                this.reloadPage();
            });
    };

    setFile = function (event) {
        //debugger
        this.newFileData.upfile = event.target.files[0]
    }

    reloadPage = function(){
        this.goToRoute(this.myContentService.getCurrenFolder());
    }

    addNewFile = function () {
        //this.myContentService.addNewFile();

        // debugger
        const uploadData = new FormData();
        uploadData.append('filename', this.newFileData.upfile.name);
        uploadData.append('upfile', this.newFileData.upfile);
        uploadData.append('folderName', this.myContentService.getCurrenFolder());
        uploadData.append('userId', this.authService.getUserID());

        // this.newFileDetails.filename = filedata.filename;
        // this.newFileDetails.folderName = this.getCurrenFolder(); // get from service
        // this.newFileDetails.userId = this._userID;
        // this.newFileDetails.upfile = filedata.upfile;
        // debugger
        this.myContentService.addNewFile(uploadData)
            .subscribe(event => {
                console.log(event);
                this.newFileData.filename = "";
                this.newFileData.upfile = {};
                $("#initNewFile").modal('hide');
                this.reloadPage();
            });
    }

}
