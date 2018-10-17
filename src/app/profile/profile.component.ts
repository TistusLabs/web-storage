import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AuditTrailService } from '../services/audittrail.service';
import { profileObject } from '../filemanager';
import {JwtHelperService} from "@auth0/angular-jwt";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    constructor(private authService: AuthService, private auditTrailService: AuditTrailService) { }
    private profileDetails: any;
    private editContent = false;
    ngOnInit() {
        this.getprofileData();
    }

    getprofileData() {
        const jwt = this.authService.extractToken();
        this.authService.getProfile(jwt.nameid).subscribe(data => {
            if (typeof data == "string") {
                this.profileDetails = {};
            } else {
                this.profileDetails = data;
                this.profileDetails.imageurl = this.profileDetails.imageurl == "" || this.profileDetails.imageurl == null ? "assets/images/avatar.png" : "http://dmsuat.eastus.cloudapp.azure.com" + this.profileDetails.imageurl;
            }
        });
    }

    editFile(flag) {
        if (flag) {
            this.editContent = true;
        } else {
            this.editContent = false;
            this.updateProfileDetails();
        }
    }

    cancelEdit() {
        this.editContent = false;
    }

    private setFile = function (event, eventType) {
        if (eventType === 'dnd') {
            this.profileDetails.upfile = event.dataTransfer.files[0];
        } else {
            this.profileDetails.upfile = event.target.files[0];
        }
    }

    updateProfileDetails() {
        const uploadData = new FormData();
        const jwt = this.authService.extractToken();
        uploadData.append('profileId', this.profileDetails.profileId == undefined ? null : this.profileDetails.profileId);
        uploadData.append('firstName', this.profileDetails.firstName);
        uploadData.append('lastName', this.profileDetails.lastName);
        uploadData.append('email', this.profileDetails.email);
        uploadData.append('upfile', this.profileDetails.upfile);

        this.authService.saveProfile(uploadData, jwt.nameid)
            .subscribe(event => {
                this.auditTrailService.addAudiTrailLog("Profile details updated for user '" + this.profileDetails.firstName + " " + this.profileDetails.lastName + "'");
                this.getprofileData();
            });
    }

}
