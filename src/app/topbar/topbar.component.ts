import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../assets/data/user';
import { MyContentService } from '../services/mycontent.service';
import { AuthService } from '../services/auth.service';
import { Router, NavigationExtras } from '@angular/router';
import { UIHelperService } from '../services/uihelper.service';
import { AuditTrailService } from '../services/audittrail.service';
import { profileObject, FileTemplate } from '../filemanager';
import { BroadcasterService } from 'ng-broadcaster';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['topbar.component.scss']
})

export class TopbarComponent implements OnInit, OnDestroy {
    user: User = {
        name: 'Username',
        type: 'admin',
        username: null,
        password: null
    };
    newFolderData = {
        name: ""
    };

    newFilesData = [];

    tempFileSize = 0;
    searchtext = "";
    authPermissions = {};
    xsSearchBar = false;
    private subscription: Subscription;
    fileTypes = [];
    fileUploaderCounter = 0;
    filesUploading = false;

    constructor(
        public myContentService: MyContentService,
        private authService: AuthService,
        private router: Router,
        public uiHelperService: UIHelperService,
        private auditTrailService: AuditTrailService,
        private broadcaster: BroadcasterService
    ) { }
    fileReady = false;
    itemsLayout = 'grid';
    ngOnInit() {
        this.uiHelperService.itemsLayoutEmitter.subscribe(il => {
            this.itemsLayout = il;
        });
        const jwt = this.authService.extractToken();
        this.authService.getProfile(jwt.nameid).subscribe(data => {
            this.setProfileDetails(data);
        })
        this.authPermissions = this.authService.getAuthPermissions();
        this.subscription = this.broadcaster.on<FileTemplate[]>('itemsPopulated').subscribe(
            data => {
                this.fileTypes = [];
                this.fileTypes.push("all");
                for (const file of data) {

                    if (file.contentType != undefined) {
                        if (!this.fileTypeAlreadyExisits(file.contentType)) {
                            this.fileTypes.push(file.contentType);
                        }
                    }
                }
            }
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    fileTypeAlreadyExisits = function (type) {
        let flag = false;
        for (const ftype of this.fileTypes) {
            if (ftype == type) {
                flag = true;
            }
        }
        return flag;
    }

    executeFilter = function (type) {
        this.broadcaster.broadcast('filterItems', type);
    };

    setProfileDetails = function (data) {
        if (typeof data != "string") {
            this.user.name = data.firstName + " " + data.lastName;
            this.user.image = data.imageurl == "" || data.imageurl == null ? "assets/images/avatar.png" : "http://dmsuat.eastus.cloudapp.azure.com" + data.imageurl;
        } else {
            this.user.name = "Username";
            this.user.image = "assets/images/avatar.png";
        }
    }

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

    gotoProfile = function () {
        this.router.navigate(['ws/profile']);
    }

    addNewFolder = function () {
        // this.myContentService.addNewFolder(this.newFolderData);
        // this.newFolderData.name = "";

        this.myContentService.addNewFolder(this.newFolderData)
            .subscribe(newFolderinfo => {
                debugger
                this.auditTrailService.addAudiTrailLog("Created new folder '" + this.newFolderData.name + "'");
                this.newFolderData.name = "";
                $("#initNewFolder").modal('hide');
                this.reloadPage();
            });
    };

    executeSearch = function () {
        let navigationExtras: NavigationExtras = {
            queryParams: { 'search': this.searchtext }
        };
        this.router.navigate(['ws/dashboard'], navigationExtras);
    };

    toggleXSSearch = function () {
        this.xsSearchBar = !this.xsSearchBar;
    };

    browseFileInit() {
        $('#upFile').click();
    }

    onDrop(event: any) {
        event.preventDefault();
        this.setFile(event, 'dnd');
    }

    onDragOver(evt) {
        evt.preventDefault();
        $('#fileDragNDrop').addClass('draggedOver');
    }

    onDragLeave(evt) {
        evt.preventDefault();
        $('#fileDragNDrop').removeClass('draggedOver');
    }

    setFile = function (event, eventType) {
        if (eventType === 'dnd') {
            this.newFilesData.push({
              upfile : event.dataTransfer.files[0],
              size : this.uiHelperService.formatBytes(event.dataTransfer.files[0].size)
            });
        } else {
          this.newFilesData.push({
            upfile : event.target.files[0],
            size : this.uiHelperService.formatBytes(event.target.files[0].size)
          });
        }
        this.fileReady = true;
    }

    reloadPage = function () {
        this.goToRoute(this.myContentService.getCurrenFolder());
    };

    addNewFile = function () {
        //this.myContentService.addNewFile();

        // debugger
        if (this.newFilesData.length) {
          this.filesUploading = true;
          for (const file of this.newFilesData) {
            const uploadData = new FormData();
            uploadData.append('filename', file.upfile.name);
            uploadData.append('upfile', file.upfile);
            uploadData.append('folderName', this.myContentService.getCurrenFolder());
            uploadData.append('userId', this.authService.getUserID());
            uploadData.append('fileSize', file.upfile.size);
            uploadData.append('contentType', file.upfile.type);

            // this.newFileDetails.filename = filedata.filename;
            // this.newFileDetails.folderName = this.getCurrenFolder(); // get from service
            // this.newFileDetails.userId = this._userID;
            // this.newFileDetails.upfile = filedata.upfile;
            // debugger
            this.myContentService.addNewFile(uploadData)
              .subscribe(event => {
                this.fileUploaderCounter ++;
                this.auditTrailService.addAudiTrailLog("Uploaded file '" + file.upfile.name + "'");
                console.log(event);
                // this.newFileData.filename = "";
                // this.newFileData.upfile = {};
                if (this.fileUploaderCounter === this.newFilesData.length) {
                  this.fileReady = false;
                  this.filesUploading = false;
                  this.newFilesData = [];
                  $('#initNewFile').modal('hide');
                  this.reloadPage();
                }
              });
          }
        }
    }

    logoutUser = function () {
        if (confirm("Are you sure you want to logout?")) {
            this.authService.logoutUser();
        }
    }

  cancelFileUpload = () => {
      this.newFilesData = [];
  }

}
