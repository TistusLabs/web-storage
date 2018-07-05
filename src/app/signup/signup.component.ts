import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) { }

  private newUserDetails = {
    username: "",
    password: ""
  }
  private userpermission;

  ngOnInit() {
  }

  signupUser() {
    this.userpermission = {};
    this.userpermission.canEdit = 0;
    this.userpermission.canView = 0;
    this.userpermission.canDownload = 0;
    this.userpermission.canAdd = 0;
    this.userpermission.canDelete = 0;
    this.authService.signUpUser({ "user": this.newUserDetails, "permissions": this.userpermission })
      .subscribe(data => {
        alert("new user was created");
        this.navigatePage();
      });
  }

  navigatePage() {
    this.router.navigate(['auth']);
  }
}
