import { Component, OnInit } from '@angular/core';
import { userObject, userPermissionObject } from '../filemanager';
import { AuthService } from '../services/auth.service';
import { AuditTrailService } from '../services/audittrail.service';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

	constructor(private authService: AuthService, private auditTrailService: AuditTrailService) { }

	userpermission;
	newUser;
	newPermission;
	allusers = new Array<userObject>();

	ngOnInit() {
		this.resetNewUser();
		this.loadAllUsers();
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
		return this.newPermission;
	}

	private addNewUser() {
		debugger
		let userobj = this.getPermissionObject();
		this.authService.signUpUser({ "user": this.newUser, "permissions": userobj })
			.subscribe(data => {
				this.auditTrailService.addAudiTrailLog("User '"+this.newUser.username+"' was created.");
				alert("new user was created");
				this.loadAllUsers();
				this.resetNewUser();
			});
	}

}
