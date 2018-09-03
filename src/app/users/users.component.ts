import { Component, OnInit } from '@angular/core';
import {IFilemanager, userObject, userPermissionObject} from '../filemanager';
import { AuthService } from '../services/auth.service';
import { AuditTrailService } from '../services/audittrail.service';
import { MyContentService } from '../services/mycontent.service';
import {HttpEvent} from "@angular/common/http";

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

    constructor(
        private authService: AuthService,
        private myContentService: MyContentService,
        private auditTrailService: AuditTrailService) { }

    userpermission;
    newUser;
    newPermission;
    allusers = new Array<userObject>();
    shareContent = [];

    ngOnInit() {
        this.resetNewUser();
        this.loadAllUsers();
        this.getAllContent();
    }

    private loadAllUsers() {
        this.authService.getAllUsers().subscribe(userdetails => {
            this.allusers = new Array<userObject>();
            for (const user of Object.keys(userdetails)) {
                let newuser = <userObject>{};
                newuser.userId = userdetails[user].userId;
                newuser.username = userdetails[user].username;
                newuser.userType = userdetails[user].userType;
                this.allusers.push(newuser);
            }
        });
    }

    private resetNewUser() {
        this.newUser = new userObject();
        this.newPermission = new userPermissionObject();
        this.userpermission = {};
        this.userpermission.canEdit = false;
        this.userpermission.canView = false;
        this.userpermission.canDownload = false;
        this.userpermission.canAdd = false;
        this.userpermission.canDelete = false;
        this.userpermission.createFolder = false;
    }

    private setFile = function (event, eventType) {
        if (eventType === 'dnd') {
            this.newUser.upfile = event.dataTransfer.files[0];
        } else {
            this.newUser.upfile = event.target.files[0];
        }
    }

    private addNewProfile(user) {
        const uploadData = new FormData();
        uploadData.append('profileId', null);
        uploadData.append('firstName', user.firstName);
        uploadData.append('lastName', user.lastName);
        uploadData.append('email', user.email);
        uploadData.append('upfile', user.upfile);

        this.authService.saveProfile(uploadData)
            .subscribe(_data => {
                debugger;
                this.auditTrailService.addAudiTrailLog("Created new profile for user '" + user.firstName + " " + user.lastName + "'");

                /* Username + Password setup */
                this.authService.updateUser(_data.userId, user.username, user.password)
                    .subscribe(date => {
                        alert("New user has been created");
                        $("#initNewUser").modal('hide');
                    });

                /* Sharing selected content */
                let toShare = [];
                function takeShared(c) {
                    for (const s of c) {
                        if (s.isChecked) {
                            toShare.push(s.uniqueFileName);
                        }
                        if (s.children){
                            if (s.children.length > 0) {
                                takeShared(s.children);
                            }
                        }
                    }
                }
                takeShared(this.shareContent);
                // this.myContentService.shareWithUser(toShare, _data.userId, 'folder')
                //     .subscribe(data => {
                //         alert("Shared file with the selected Users.");
                //
                //         // if (userIDs.length > ++index) {
                //         //     this.addPermissionToUser(userIDs, index++, this.selectedContentItem.uniqueFileName);
                //         // } else {
                //         //     alert("Shared file with the selected Users.");
                //         // }
                //     });

            });
    }

    private getPermissionObject() {
        this.newPermission = new userPermissionObject();
        if (this.userpermission.canEdit) {
            this.newPermission.canEdit = 1;
        }
        if (this.userpermission.canView) {
            this.newPermission.canView = 1;
        }
        if (this.userpermission.canDownload) {
            this.newPermission.canDownload = 1;
        }
        if (this.userpermission.canAdd) {
            this.newPermission.canAdd = 1;
        }
        if (this.userpermission.canDelete) {
            this.newPermission.canDelete = 1;
        }
        if (this.userpermission.createFolder) {
            this.newPermission.createFolder = 1;
        }
        return this.newPermission;
    }

    private addNewUser() {
        let userobj = this.getPermissionObject();
        this.authService.signUpUser({ "user": this.newUser, "permissions": userobj })
            .subscribe(data => {
                this.addNewProfile(this.newUser);
                this.auditTrailService.addAudiTrailLog("User '" + this.newUser.username + "' was created.");
                // alert("new user was created");
                this.loadAllUsers();
                this.resetNewUser();
            });
    }

    private extractItems(data) {
        let obj = [];
        let folder = {'name':'','uniqueFileName':'','visited':false,'isFOpen':false,'children':[],'type':'Folder','isChecked':false};
        let file = {'name':'','uniqueFileName':'', 'type': 'File','isChecked':false};

        for (const _f of data.folders) {
            folder.name = _f.folderName;
            folder.uniqueFileName = _f.uniqueName;
            obj.push(folder);
            folder = {'name':'','uniqueFileName':'','visited':false,'isFOpen':false,'children':[],'type':'Folder','isChecked':false};
        }
        for (const __f of data.files) {
            file.name = __f.filename;
            file.uniqueFileName = __f.uniqueFileName;
            obj.push(file);
            file = {'name':'','uniqueFileName':'', 'type': 'File','isChecked':false};
        }
        return obj;
    }

    private getAllContent() {
        this.myContentService.getAllFolders()
            .subscribe(data => {
                this.shareContent = this.extractItems(data);
            });
    }

    getFolderItems(f) {
        f.isFOpen = !f.isFOpen;
        if (!f.visited) {
            this.myContentService.getItemsInFolder(f.uniqueFileName)
                .subscribe(data => {
                    let folderItems = this.extractItems(data);
                    let ul = document.createElement('ul');
                    ul.setAttribute('id', f.uniqueFileName+'collap');
                    ul.setAttribute('class', 'collapse show');
                    for (const fi of folderItems) {
                        f.children.push(fi);
                    }
                    $('#share'+f.uniqueFileName).append(ul);
                    f.visited = true;
                });
        }
    };

}
