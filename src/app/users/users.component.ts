import { Component, OnInit } from '@angular/core';
import { userObject, userPermissionObject } from '../filemanager';
import { AuthService } from '../services/auth.service';
import { AuditTrailService } from '../services/audittrail.service';
import { MyContentService } from '../services/mycontent.service';
import { UIHelperService } from '../services/uihelper.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

    constructor(
        private authService: AuthService,
        private myContentService: MyContentService,
        private uiHelperService: UIHelperService,
        private auditTrailService: AuditTrailService) { }

    user;
    userpermission;
    newUser;
    newPermission;
    allusers = new Array<userObject>();
    shareContent = [];
    itemsLayout = 'grid';
    shareOnUserCreateCounter = 0;
    userLoading = false;
    userEditing = false;
    formStatus = "";
    userToUpdateContent = {
        files: [],
        folders: [],
        sharedFiles: [],
        sharedFolders: []
    };
    candidateUser = null;

    ngOnInit() {
        this.resetNewUser();
        this.loadAllUsers();
        this.getAllContent();
        this.user = this.authService.getProfileData();

        this.uiHelperService.itemsLayoutEmitter.subscribe(il => {
            this.itemsLayout = il;
        });
    }

    toShare = [];
    takeShared(c) {
        for (const s of c) {
            if (s.isChecked) {
                this.toShare.push({ un: s.uniqueFileName, ty: s.type });
            }
            if (s.children) {
                if (s.children.length > 0) {
                    this.takeShared(s.children);
                }
            }
        }
    }

    private loadAllUsers() {
      this.userLoading = true;
        this.authService.getAllProfiles().subscribe(userdetails => {
            this.allusers = new Array<userObject>();
            for (const user of Object.keys(userdetails)) {
                let newuser = <userObject>{};
                newuser.userId = userdetails[user].userId;
                newuser.firstName = userdetails[user].firstName;
                newuser.lastName = userdetails[user].lastName;
                newuser.email = userdetails[user].email;
                newuser.imageUrl = userdetails[user].imageurl;
                this.allusers.push(newuser);
            }

          this.userLoading = false;
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
        this.userEditing = false;
        this.userLoading = false;
    }

    private setFile = function (event, eventType) {
        if (eventType === 'dnd') {
            this.newUser.upfile = event.dataTransfer.files[0];
        } else {
            this.newUser.upfile = event.target.files[0];
        }
    }

    private addNewProfile(user) {
        //debugger
        const uploadData = new FormData();
        uploadData.append('profileId', null);
        uploadData.append('firstName', user.firstName);
        uploadData.append('lastName', user.lastName);
        uploadData.append('email', user.email);
        uploadData.append('upfile', user.upfile);
        debugger
        this.authService.saveProfile(uploadData, user.userId)
            .subscribe(_data => {
                debugger;
                this.auditTrailService.addAudiTrailLog("Created new profile for user '" + user.firstName + " " + user.lastName + "'");

                /* Sharing selected content */
                this.takeShared(this.shareContent);
                if (this.toShare.length > 0) {
                    for (let s = 0; s < this.toShare.length; s++) {
                        this.myContentService.shareWithUser(this.toShare[s].un, _data.userId.toString(), this.toShare[s].ty.toLowerCase())
                            .subscribe(data => {
                                this.shareOnUserCreateCounter++;
                                if (this.toShare.length > 0) {
                                    if (this.shareOnUserCreateCounter == this.toShare.length) {
                                        alert("Shared file with the selected Users.");
                                        this.shareOnUserCreateCounter = 0;
                                        $("#initNewUser").modal('hide');
                                        this.userEditing = false;
                                    };
                                }
                                else {
                                    $("#initNewUser").modal('hide');
                                    this.userEditing = false;
                                    alert("Shared file with the selected Users.");
                                }
                                // if (userIDs.length > ++index) {
                                //     this.addPermissionToUser(userIDs, index++, this.selectedContentItem.uniqueFileName);
                                // } else {
                                //     alert("Shared file with the selected Users.");
                                // }
                            });
                    }
                } else {
                    $("#initNewUser").modal('hide');
                    this.userEditing = false;
                    alert("User saved successfully");
                }
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
        if (this.userpermission.canShare) {
            this.newPermission.canShare = 1;
        }
        if (this.userpermission.canUnShare) {
            this.newPermission.canUnShare = 1;
        }
        return this.newPermission;
    }

    private addNewUser() {
        let userobj = this.getPermissionObject();
        if (this.userEditing) {
            debugger
            this.authService.updateUser(this.newUser)
                .subscribe(updatedUser => {
                    this.authService.updateUserPermission(this.newUser.userId, userobj)
                        .subscribe(updatedPermissions => {
                            this.addNewProfile(this.newUser);
                        });
                });

        } else {
            this.authService.signUpUser({ "user": this.newUser, "permissions": userobj, "data": null })
                .subscribe(data => {
                    if (data['status']) {
                      this.newUser.userId = data['data'].userId;
                      this.addNewProfile(this.newUser);
                      this.auditTrailService.addAudiTrailLog("User '" + this.newUser.username + "' was created.");
                      // alert("new user was created");
                      this.loadAllUsers();
                      this.resetNewUser();
                    } else {
                      alert(data['error']);
                    }
                });
        }
    }

    private extractItems(data) {
        let obj = [];
        let folder = { 'name': '', 'uniqueFileName': '', 'visited': false, 'isFOpen': false, 'children': [], 'type': 'Folder', 'isChecked': false };
        let file = { 'name': '', 'uniqueFileName': '', 'type': 'File', 'isChecked': false };

        for (const _f of data.folders) {
            folder.name = _f.folderName;
            folder.uniqueFileName = _f.uniqueName;
            obj.push(folder);
            folder = { 'name': '', 'uniqueFileName': '', 'visited': false, 'isFOpen': false, 'children': [], 'type': 'Folder', 'isChecked': false };
        }
        for (const __f of data.files) {
            file.name = __f.filename;
            file.uniqueFileName = __f.uniqueFileName;
            obj.push(file);
            file = { 'name': '', 'uniqueFileName': '', 'type': 'File', 'isChecked': false };
        }
        return obj;
    }

    private getAllContent() {
        this.myContentService.getAllFolders()
            .subscribe(data => {
                this.shareContent = this.extractItems(data);
            });
    }

    getFolderItems(f, setShared) {
        f.isFOpen = !f.isFOpen;
        if (!f.visited) {
            this.myContentService.getItemsInFolder(f.uniqueFileName)
                .subscribe(data => {
                    let folderItems = this.extractItems(data);
                    let ul = document.createElement('ul');
                    ul.setAttribute('id', f.uniqueFileName + 'collap');
                    ul.setAttribute('class', 'collapse show');
                    for (const fi of folderItems) {
                      if (f.type === "Folder" && f.isChecked && this.userEditing) {
                        fi.isChecked = true;
                      } else {
                        if (fi.type == 'Folder') {
                          for (const sfo of this.userToUpdateContent.sharedFolders) {
                            if (sfo.uniqueName == fi.uniqueFileName) {
                              fi.isChecked = true;
                            }
                          }
                        } else if (fi.type == 'File') {
                          for (const sfi of this.userToUpdateContent.sharedFiles) {
                            if (sfi.uniqueFileName == fi.uniqueFileName) {
                              fi.isChecked = true;
                            }
                          }
                        }
                      }
                      f.children.push(fi);
                    }
                    // $('#share'+f.uniqueFileName).append(ul);
                    f.visited = true;
                });
        }
    };

    setCandidateUser = function (user) {
      this.candidateUser = user;
    };

    createNewUser = function () {
        this.resetNewUser();
        this.formStatus = "new";
    };

    updateUser(id) {
        this.resetNewUser();
        this.formStatus = "update";
        this.userLoading = true;
        this.userEditing = true;
        let servicesMarker = 0;
        this.authService.getProfileInfo(id)
            .subscribe(data => {
                this.newUser = {
                  email: data['email'],
                  firstName: data['firstName'],
                  imageurl: data['imageurl'],
                  lastName: data['lastName'],
                  profileId: data['profileId'],
                  userId: data['userId']
                };
                servicesMarker == 3 ? this.userLoading = false : servicesMarker += 1;
            });
        this.authService.getAllUsers()
            .subscribe(_data => {
                for (const p of Object.keys(_data)) {
                    if (_data[p].userId == id) {
                        this.newUser.password = _data[p].password;
                        this.newUser.username = _data[p].username;
                        this.newUser.userType = _data[p].userType;
                        this.newUser.active = _data[p].active;
                    }
                }
                servicesMarker == 3 ? this.userLoading = false : servicesMarker += 1;
            });
        this.shareContent == [];
      this.myContentService.getAllFolders()
        .subscribe(data => {
          this.shareContent = this.extractItems(data);
          this.myContentService.getItemsByUserId(id)
            .subscribe((usercont: any) => {
              this.userToUpdateContent = usercont;
              debugger;
              for (const sc of this.shareContent) {
                if (sc.type == 'Folder') {
                  for (const sfo of usercont.sharedFolders) {
                    if (sfo.uniqueName == sc.uniqueFileName) {
                      sc.isChecked = true;
                    }
                  }
                } else if (sc.type == 'File') {
                  for (const sfi of usercont.sharedFiles) {
                    if (sfi.uniqueFileName == sc.uniqueFileName) {
                      sc.isChecked = true;
                    }
                  }
                }
              }
              servicesMarker == 3 ? this.userLoading = false : servicesMarker += 1;
            });
        });

        this.authService.getUserPermission(id)
            .subscribe(userPermissions => {
                this.userpermission = userPermissions;
                servicesMarker == 3 ? this.userLoading = false : servicesMarker += 1;
            });
    }

    deleteUser(id) {
        this.userLoading = true;
        $("#initDeleteUser").modal('hide');
        this.authService.deleteUser(id)
            .subscribe((userdelres: any) => {
              if(userdelres.status) {
                this.loadAllUsers();
              }else{
                alert("Error deleting user");
                this.loadAllUsers();
              }
            });
    }

}
