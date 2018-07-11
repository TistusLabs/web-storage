import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContentItems } from '../../assets/data/content';
import { MyContentService } from '../services/mycontent.service';
import { Router, ActivatedRoute, NavigationExtras, NavigationEnd } from '@angular/router';
import { IFilemanager, userObject, FileTemplate } from '../filemanager';
import { HttpParams, HttpResponse, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import * as moment from 'moment';
import { UIHelperService } from '../services/uihelper.service';
import { AuditTrailService } from '../services/audittrail.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
    navigationSubscription;
    allFilesFolders = [];
    content;
    layout = 'carded';
    isContentItemFull = false;
    fullViewPos = '';
    selectedContentItem = new FileTemplate();
    selectedItemFull = {
        addedDate: null,
        lastModifiedDate: null,
        name: null,
        size: null,
        width: null,
        height: null
    };
    newfilename = "";
    shareemail = "";
    imageToShow: any;
    itemLoading = '';
    itemsLoading = false;
    pageData: Observable<string>;
    pageID = "";
    form: FormGroup;
    allusers: Array<userObject>;
    authPermissions = {};

    constructor(
        private myContentService: MyContentService,
        private authService: AuthService,
        private actrouter: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private uiHelperService: UIHelperService,
        private auditTrailService: AuditTrailService
    ) {
        this.authService.getAllUsers().subscribe(userdetails => {
            this.allusers = new Array<userObject>();
            for (const user of Object.keys(userdetails)) {
                let newuser = <userObject>{};
                newuser.userId = userdetails[user].userId;
                newuser.username = userdetails[user].username;
                newuser.userType = userdetails[user].userType;
                this.allusers.push(newuser);
            }
            const controls = this.allusers.map(c => new FormControl(false));
            // controls[0].setValue(true); // Set the first checkbox to true (checked)

            this.form = this.fb.group({
                allusers: new FormArray(controls)
            });
        });
    }

    itemsLayout = 'grid';
    ngOnInit() {
        // this.pageData = this.router
        //   .queryParamMap
        //   .pipe(map(params => params.get('page') || ''));
        // this.pageData.subscribe(data => {
        //   this.pageID = data;
        // })
        // this.myContentService.setCurrentFolder(this.pageID);
        // // this.getAllItems();
        // this.getAllItemsForPage(this.pageID);
        this.itemsLoading = true;
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            this.itemsLoading = true;
            if (e instanceof NavigationEnd) {
                this.initialiseInvites();
            }
        });
        this.getcontent();

        this.uiHelperService.itemsLayoutEmitter.subscribe(il => {
            this.itemsLayout = il;
        });

        // set auth permission object
        this.authPermissions = this.authService.getAuthPermissions();
    }

    getcontent() {
        this.actrouter.queryParams.subscribe(params => {
            if (params.page != undefined) {
                this.pageID = params.page;
                this.getcontentforPage(this.pageID);
            } else if (params.search != undefined) {
                this.pageID = "search";
                this.searchContent(params.search);
            }
        });
    }

    initialiseInvites() {
        this.getcontent();
    }

    ngOnDestroy() {
        if (this.navigationSubscription) {
            this.navigationSubscription.unsubscribe();
        }
    }

    private searchContent(query) {
        this.myContentService.searchItems(query)
            .subscribe(data => {
                this.populateItems(data);
                this.auditTrailService.addAudiTrailLog("Searched files for the query '" + query + "'");
            });
    }

    private getUserIDs(selectedUsers) {
        let userids = [];
        for (let userindex = 0; userindex < selectedUsers.length; userindex++) {
            for (let index = 0; index < this.allusers.length; index++) {
                if (this.allusers[index].username == selectedUsers[userindex]) {
                    userids.push(this.allusers[index].userId);
                }
            }
        }

        return userids;
    }

    private addPermissionToUser(userIDs, index, uniqueFileName) {
        this.myContentService.shareFileWithUser(uniqueFileName, userIDs[index])
            .subscribe(data => {
                //this.populateItems(data);
                if (userIDs.length > ++index) {
                    this.addPermissionToUser(userIDs, index++, this.selectedContentItem.uniqueFileName);
                } else {
                    alert("Shared file with the selected Users.");
                }
            });
    }

    setcurrentItem(item) {
        this.selectedContentItem = item;
        if (item.category != "folder") {
            this.newfilename = item.filename;
        }
        if (item.category == "folder") {
            this.newfilename = item.folderName;
        }
    }

    sharefile(item) {
        // alert("now you may share");
        const selectedOrderIds = this.form.value.allusers
            .map((v, i) => v ? this.allusers[i].username : null)
            .filter(v => v !== null);
        console.log(selectedOrderIds);
        let userIDs = this.getUserIDs(selectedOrderIds);
        this.addPermissionToUser(userIDs, 0, this.selectedContentItem.uniqueFileName);
    }

    downloadFile(item) {
        // download any file
        if (item.category != 'folder') {
            let filedetails = { "filename": item.filename, "uniqueFileName": item.uniqueFileName };

            this.myContentService.downloadContent([filedetails], []).subscribe(data => {
                debugger
                this.downloadFileFromBlob(data);
                this.auditTrailService.addAudiTrailLog("File downloaded '" + item.name + "'.");
            });
        }
        // download any folder
        if (item.category == 'folder') {
            debugger
            this.myContentService.downloadContent([], [item.uniqueName]).subscribe(data => {
                debugger
                this.downloadFileFromBlob(data);
                this.auditTrailService.addAudiTrailLog("Folder downloaded '" + item.name + "'.");
            });
        }
    }

    downloadFileFromBlob(data: HttpEvent<Blob>) {
        var blob = new Blob([data], { type: 'application/zip' });
        var url = window.URL.createObjectURL(blob);
        window.open(url);
    }

    renameDocument() {
        if (this.selectedContentItem.category == 'image') {
            this.myContentService.renameFile(this.newfilename, this.selectedContentItem.uniqueFileName).subscribe(data => {
                this.getcontentforPage(this.pageID);
                this.auditTrailService.addAudiTrailLog("Renamed file from '" + this.selectedContentItem.name + "' to '" + this.newfilename + "'.");
                alert("File rename successfull.");
            });
        }
        if (this.selectedContentItem.category == 'folder') {
            this.myContentService.renameFolder(this.newfilename, this.selectedContentItem.uniqueName).subscribe(data => {
                this.auditTrailService.addAudiTrailLog("Renamed folder from '" + this.selectedContentItem.folderName + "' to '" + this.newfilename + "'.");
                this.getcontentforPage(this.pageID);
                alert("Folder rename successfull.");
            });
        }
    }

    shareDocumentbyEmail() {
        debugger
        let authObjet = this.authService.getAuthObject();
        let subject = authObjet.unique_name + " shared a file with you - Web-Storage";
        let body = "Hi, " + authObjet.unique_name + " has shared a file with you.\nThankyou."
        let to = [this.shareemail];
        let cc = ["tistuslabs@gmail.com"];
        let filename = this.selectedContentItem.uniqueFileName;
        this.myContentService.shareByEmail(subject, body, to, cc, filename).subscribe(data => {
            this.auditTrailService.addAudiTrailLog("Shared a file with " + to + ".");
            this.getcontentforPage(this.pageID);
            alert("File sharing successfull.");
        });
    }

    starfile(item) {
        this.itemLoading = item.id;
        this.myContentService.starFile(item.id).subscribe(data => {
            this.auditTrailService.addAudiTrailLog("File '" + item.name + "' marked as favorite.");
            this.itemLoading = "";
            this.getcontentforPage(this.pageID);
        });
    }

    unstartfile(item) {
        // debugger;
        this.itemLoading = item.id;
        this.myContentService.unstarFile(item.id).subscribe(data => {
            this.auditTrailService.addAudiTrailLog("File '" + item.name + "' unmarked as favorite.");
            this.itemLoading = "";
            this.getcontentforPage(this.pageID);
        });
    }

    deleteContent() {
        if (confirm("Are you sure you want to delete this " + this.selectedContentItem.category + "?")) {
            debugger
            if (this.selectedContentItem.category == 'image') {
                this.myContentService.deleteFile(this.selectedContentItem.uniqueFileName).subscribe(data => {
                    this.auditTrailService.addAudiTrailLog("Deleted file '" + this.selectedContentItem.name + "'.");
                    this.getcontentforPage(this.pageID);
                    alert("File deleted successfull.");
                });
            }
            if (this.selectedContentItem.category == 'folder') {
                this.myContentService.deleteFolder(this.selectedContentItem.uniqueName).subscribe(data => {
                    this.auditTrailService.addAudiTrailLog("Deleted folder '" + this.selectedContentItem.folderName + "'.");
                    this.getcontentforPage(this.pageID);
                    alert("Folder deleted successfull.");
                });
            }
        }
    }

    private getcontentforPage = function (page) {
        this.myContentService.setCurrentFolder(page);
        this.getAllItemsForPage(page);
    }

    private populateItems(items) {
        this.allFilesFolders = [];
        if (this.pageID == "shared") {
            for (const sharedfile of items.sharedFiles) {
                sharedfile.id = sharedfile.id;
                sharedfile.name = sharedfile.filename;
                sharedfile.starred = sharedfile.starred == null ? false : sharedfile.starred;
                sharedfile.category = 'shared';
                sharedfile.icon = 'share';
                sharedfile.fileSize = this.uiHelperService.formatBytes(sharedfile.fileSize, null);
                this.allFilesFolders.push(sharedfile);
            }
        } else if (this.pageID == "search") {
            for (const file of items) {
                file.id = file.id;
                file.name = file.filename;
                file.starred = file.starred == null ? false : file.starred;
                file.category = 'file';
                file.icon = 'image';
                file.fileSize = this.uiHelperService.formatBytes(file.fileSize, null);
                this.allFilesFolders.push(file);
            }
        } else {
            for (const folder of items.folders) {
                folder.id = folder.folderId;
                folder.name = folder.folderName;
                folder.starred = folder.starred == null ? false : folder.starred;
                folder.category = 'folder';
                folder.icon = 'folder';
                folder.fileSize = this.uiHelperService.formatBytes(folder.fileSize, null);
                this.allFilesFolders.push(folder);
            }
            for (const file of items.files) {
                file.id = file.id;
                file.name = file.filename;
                file.starred = file.starred == null ? false : file.starred;
                file.category = 'file';
                file.icon = 'image';
                file.fileSize = this.uiHelperService.formatBytes(file.fileSize, null);
                this.allFilesFolders.push(file);
            }
        }
        this.content = this.allFilesFolders;
        this.itemLoading = '';
        this.itemsLoading = false;
        // console.log(this.allFilesFolders);
    }

    private getAllItems() {
        this.myContentService.getAllFolders()
            .subscribe(data => {
                this.populateItems(data);
            });
    }

    private getAllItemsForPage(folderID: string) {
        this.myContentService.getItemsInFolder(folderID)
            .subscribe(data => {
                this.populateItems(data);
            });
    }

    changeContentLayout = function (layout) {
        this.layout = layout;
    };

    getImageDim(i, callback) {
        i.onload = function () {
            const width = i.width;
            const height = i.height;
            callback(width, height);
        };
    }

    setItemInfo(f, dim) {
        this.selectedItemFull.addedDate = 'N/A';
        this.selectedItemFull.lastModifiedDate = moment(f.lastModifiedDate).format('DD MMMM YYYY');
        this.selectedItemFull.size = this.uiHelperService.formatBytes(f.size, null);
        this.selectedItemFull.name = this.selectedContentItem.filename;
        if (dim && $(window).width() > 576) {
            this.selectedItemFull.width = dim.w;
            this.selectedItemFull.height = dim.h;
            const maxh = $('.ws-content-item-full-body').height();
            if (dim.h > maxh) {
                $('.ws-content-item-preview img').css('height', maxh + 'px');
            }
        }
    }

    createImageFromBlob(image: Blob) {
        let reader = new FileReader();
        reader.addEventListener("load", () => {
            this.imageToShow = reader.result;
            let f = null;
            const ext = this.selectedContentItem.filename.split('.').pop();
            if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'svg' || ext === 'gif') {
                f = new File([this.imageToShow.split(',')[1]], 'file', {});
                const img = new Image;
                img.src = this.imageToShow;
                this.getImageDim(img, (w, h) => this.setItemInfo(f, { h: h, w: w }));
            } else {
                f = new File([this.imageToShow.split(',')[1]], 'file', {});
                this.setItemInfo(f, null);
            }
        }, false);

        if (image) {
            reader.readAsDataURL(image);
        }
    }

    openContentItem = function (item, e) {
        // debugger
        if (e.target.className.split(' ')[0] != 'ws-overhead-btn') {
            if (item.category == "folder") {
                // debugger
                this.itemLoading = item.id;
                this.goToRoute(item.uniqueName);
            } else {
                // debugger
                this.imageToShow = Object;
                this.itemLoading = item.id;
                for (var i = 0; i < this.allFilesFolders.length; i++) {
                    if (this.allFilesFolders[i].id == item.id) {
                        const count = i;
                        this.myContentService.getItemToDisplay(item.uniqueFileName, item.userId)
                            .subscribe((resp: HttpResponse<Blob>) => {
                                //debugger
                                console.log("Item to display:", this.allFilesFolders[count]);
                                this.selectedContentItem = this.allFilesFolders[count];
                                this.createImageFromBlob(resp);
                                // this.selectedContentItem.filedata = data;
                                this.isContentItemFull = true;
                                this.itemLoading = '';
                            });
                    }
                }
                // this.fullViewPos = 'width:100%;height:100%';
            }
        }
    };

    goToRoute = function (route) {
        let navigationExtras: NavigationExtras = {
            queryParams: { 'page': route }
        };
        this.router.navigate(['ws/dashboard'], navigationExtras);
    }

    closeContentFull = function () {
        this.isContentItemFull = false;
    };

}
