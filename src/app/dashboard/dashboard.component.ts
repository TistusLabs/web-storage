import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContentItems } from '../../assets/data/content';
import { MyContentService } from '../services/mycontent.service';
import { Router, ActivatedRoute, NavigationExtras, NavigationEnd } from '@angular/router';
import { IFilemanager, userObject, FileTemplate } from '../filemanager';
import { HttpParams, HttpResponse, HttpEvent } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import * as moment from 'moment';
import { UIHelperService } from '../services/uihelper.service';
import { AuditTrailService } from '../services/audittrail.service';
import { BroadcasterService } from 'ng-broadcaster';

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
    private subscription: Subscription;
    filterByType = "";

    constructor(
        private myContentService: MyContentService,
        private authService: AuthService,
        private actrouter: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private uiHelperService: UIHelperService,
        private auditTrailService: AuditTrailService,
        private broadcaster: BroadcasterService
    ) {
        this.authService.getAllProfiles()
          .subscribe(allprofiles => {
            this.authService.getAllUsers()
              .subscribe(allusers => {
                this.allusers = new Array<userObject>();
                for (const profile of Object.keys(allprofiles)) {
                  let newuser = <userObject>{};
                  for (const user of Object.keys(allusers)) {
                    newuser.userId = allprofiles[profile].userId;
                    newuser.username = allprofiles[profile].firstName + " " + allprofiles[profile].lastName;
                    if(allprofiles[profile].userId === allusers[user].userId){
                      newuser.userType = allusers[user].userType;
                    }
                  }
                  this.allusers.push(newuser);
                }
                debugger
                this.allusers = this.allusers.sort((a,b) => {
                  if(a.username < b.username) { return -1; }
                  if(a.username > b.username) { return 1; }
                  return 0;
                });
                const controls = this.allusers.map(c => new FormControl(false));
                // controls[0].setValue(true); // Set the first checkbox to true (checked)

                this.form = this.fb.group({
                  allusers: new FormArray(controls)
                });

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

        this.subscription = this.broadcaster.on<string>('filterItems').subscribe(
            data => {
                this.filterByType = data;
            }
        );
    }

    getcontent() {
        this.filterByType = "";
        let remark = null;
        this.actrouter.queryParams.subscribe(params => {
            if (params.page != undefined) {
                this.pageID = params.page;
                if(params.remark){
                  remark = JSON.parse(params.remark);
                }
                this.getcontentforPage(this.pageID, remark);
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
        debugger;
        this.myContentService.shareWithUser(uniqueFileName, userIDs[index], this.selectedContentItem.category)
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
      debugger
        this.selectedContentItem = item;
        if (item.category != "folder") {
            this.newfilename = item.filename;
        }
        if (item.category == "folder") {
            this.newfilename = item.folderName;
        }
    }

    sharefile(item) {
        debugger;
        // alert("now you may share");
        const selectedOrderIds = this.form.value.allusers
            .map((v, i) => v ? this.allusers[i].username : null)
            .filter(v => v !== null);
        console.log(selectedOrderIds);
        let userIDs = this.getUserIDs(selectedOrderIds);
        let uniqueName = '';
        this.selectedContentItem.uniqueFileName != undefined ? uniqueName = this.selectedContentItem.uniqueFileName : uniqueName = this.selectedContentItem.uniqueName;
        this.addPermissionToUser(userIDs, 0, uniqueName);
    }

    closeShareDialog() {
      this.form.reset();
    }
    // $("#initShareFile").on('hidden.bs.modal', function () {
    //   $(this).data('bs.modal', null);
    // });

    unShareItem (item) {
      this.itemLoading = item.id;
      this.myContentService.unShareItem(item)
        .subscribe(unshareres => {
          this.itemLoading = item.id;
          debugger;
        });
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
        if (this.selectedContentItem.category == 'file') {
            this.myContentService.renameFile(this.newfilename, this.selectedContentItem.uniqueFileName).subscribe(data => {
                this.getcontentforPage(this.pageID, null);
                this.auditTrailService.addAudiTrailLog("Renamed file from '" + this.selectedContentItem.name + "' to '" + this.newfilename + "'.");
                alert("File rename successfull.");
            });
        }
        if (this.selectedContentItem.category == 'folder') {
            this.myContentService.renameFolder(this.newfilename, this.selectedContentItem.uniqueName).subscribe(data => {
                this.auditTrailService.addAudiTrailLog("Renamed folder from '" + this.selectedContentItem.folderName + "' to '" + this.newfilename + "'.");
                this.getcontentforPage(this.pageID, null);
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
            this.getcontentforPage(this.pageID, null);
            alert("File sharing successfull.");
        });
    }

    starfile(item) {
        this.itemLoading = item.id;
        this.myContentService.starFile(item.id).subscribe(data => {
            this.auditTrailService.addAudiTrailLog("File '" + item.name + "' marked as favorite.");
            this.itemLoading = "";
            this.getcontentforPage(this.pageID, null);
        });
    }

    unstartfile(item) {
        // debugger;
        this.itemLoading = item.id;
        this.myContentService.unstarFile(item.id).subscribe(data => {
            this.auditTrailService.addAudiTrailLog("File '" + item.name + "' unmarked as favorite.");
            this.itemLoading = "";
            this.getcontentforPage(this.pageID, null);
        });
    }

    deleteContent() {
        if (confirm("Are you sure you want to delete this " + this.selectedContentItem.category + "?")) {
            debugger
            if (this.selectedContentItem.category == 'file') {
                this.myContentService.deleteFile(this.selectedContentItem.uniqueFileName).subscribe(data => {
                    this.auditTrailService.addAudiTrailLog("Deleted file '" + this.selectedContentItem.name + "'.");
                    this.getcontentforPage(this.pageID, null);
                    alert("File deleted successfull.");
                });
            }
            if (this.selectedContentItem.category == 'folder') {
                this.myContentService.deleteFolder(this.selectedContentItem.uniqueName).subscribe(data => {
                    this.auditTrailService.addAudiTrailLog("Deleted folder '" + this.selectedContentItem.folderName + "'.");
                    this.getcontentforPage(this.pageID, null);
                    alert("Folder deleted successfull.");
                });
            }
        }
    }

    private getcontentforPage = function (page, remark) {
        this.myContentService.setCurrentFolder(page);
      if(remark) {
        this.getSharedFolderItems(page, remark)
      } else {
        this.getAllItemsForPage(page);
      }
    }

    private populateItems(items) {
        this.allFilesFolders = [];
        if (this.pageID == "shared") {
            for (const sharedfile of items.sharedFiles) {
                sharedfile.id = sharedfile.id;
                sharedfile.name = sharedfile.filename;
                sharedfile.starred = sharedfile.starred == null ? false : sharedfile.starred;
                sharedfile.category = 'file';
                sharedfile.remark = 'shared';
                sharedfile.icon = 'add_photo_alternate';
                sharedfile.fileSize = this.uiHelperService.formatBytes(sharedfile.fileSize, null);
                this.allFilesFolders.push(sharedfile);
            }
            for (const sharedFolder of items.sharedFolders) {
                sharedFolder.id = sharedFolder.folderId;
                sharedFolder.name = sharedFolder.folderName;
                sharedFolder.starred = false;
                sharedFolder.category = 'folder';
              sharedFolder.remark = 'shared';
              sharedFolder.icon = 'folder_shared';
                sharedFolder.fileSize = "";
                this.allFilesFolders.push(sharedFolder);
            }
        } else if (this.pageID == "search") {
            for (const file of items) {
                file.id = file.id;
                file.name = file.filename;
                file.starred = file.starred == null ? false : file.starred;
                file.category = 'file';
                //file.icon = 'image';
                file.icon = this.getMimeType(file.contentType);
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
                // file.icon = 'image';
                file.icon = this.getMimeType(file.contentType);
                file.fileSize = this.uiHelperService.formatBytes(file.fileSize, null);
                this.allFilesFolders.push(file);
            }
            // for (const sharedfile of items.sharedFiles) {
            //     sharedfile.id = sharedfile.id;
            //     sharedfile.name = sharedfile.filename;
            //     sharedfile.starred = sharedfile.starred == null ? false : sharedfile.starred;
            //     sharedfile.category = 'file';
            //     sharedfile.icon = 'add_photo_alternate';
            //     sharedfile.fileSize = this.uiHelperService.formatBytes(sharedfile.fileSize, null);
            //     this.allFilesFolders.push(sharedfile);
            // }
            // for (const sharedFolder of items.sharedFolders) {
            //     sharedFolder.id = sharedFolder.folderId;
            //     sharedFolder.name = sharedFolder.folderName;
            //     sharedFolder.starred = false;
            //     sharedFolder.category = 'folder';
            //     sharedFolder.icon = 'folder_shared';
            //     sharedFolder.fileSize = "";
            //     this.allFilesFolders.push(sharedFolder);
            // }
        }
        this.content = this.allFilesFolders;
        this.itemLoading = '';
        this.itemsLoading = false;
        this.broadcaster.broadcast('itemsPopulated', this.allFilesFolders);
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

    private getSharedFolderItems(folderID: string, remark: object) {
      debugger
        this.myContentService.getSharedFolderItems(folderID, remark['userId'])
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

    getMimeType = function (contentType) {
        let x = contentType.split("/");
        console.log(x[0]);
        return x[0];
    }

    openContentItem = function (item, e) {
        // debugger
        if (e.target.className.split(' ')[0] != 'ws-overhead-btn') {
            if (item.category == "folder") {
                // debugger
                let remark = null;
                item.remark && item.remark == 'shared' ? remark = {'shared':true,'userId': item.userId} : null;
                this.itemLoading = item.id;
                this.goToRoute(item.uniqueName, remark);
            } else {
                // debugger
                this.imageToShow = Object;
                this.itemLoading = item.id;
                for (var i = 0; i < this.allFilesFolders.length; i++) {
                    if (this.allFilesFolders[i].id == item.id) {
                        const count = i;
                        console.log("Item to display:", this.allFilesFolders[count]);
                        this.myContentService.getItemToDisplay(item.uniqueFileName, item.userId)
                            .subscribe((resp: HttpResponse<Blob>) => {
                                this.selectedContentItem = this.allFilesFolders[count];
                                if (this.getMimeType(item.contentType) == "image") {
                                    this.createImageFromBlob(resp);
                                } else if (this.getMimeType(item.contentType) == "audio") {
                                    this.imageToShow = "https://cdn4.iconfinder.com/data/icons/Pretty_office_icon_part_2/256/audio-file.png";
                                } else if (this.getMimeType(item.contentType) == "text") {
                                    this.imageToShow = "https://www.freeiconspng.com/uploads/extension-file-text-txt-type-icon--icon-search-engine--21.png";
                                } else if (this.getMimeType(item.contentType) == "video") {
                                    this.imageToShow = "https://cdn0.iconfinder.com/data/icons/line-file-type-icons/100/file_video_3-512.png";
                                } else if (this.getMimeType(item.contentType) == "application") {
                                    this.imageToShow = "https://banner2.kisspng.com/20180320/acq/kisspng-binary-file-computer-icons-binary-number-source-co-binary-data-icon-5ab0c5640493f2.8305504515215343080188.jpg";
                                }
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

    goToRoute = function (route, remark) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
              'page': route,
              'remark' : JSON.stringify(remark)
            }
        };
        this.router.navigate(['ws/dashboard'], navigationExtras);
    }

    closeContentFull = function () {
        this.isContentItemFull = false;
    };

}
