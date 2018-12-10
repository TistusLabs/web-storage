import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, NavigationExtras } from "@angular/router";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  inputCredentials = {
    inputUsername: "",
    inputPassword: ""
  };

  errorMessage = "";
  // token = window.localStorage.getItem('token');
  login = function (input) {
    //debugger
    if(this.token) {
      this.authService.setAuthToken(this.token);
      let navigationExtras: NavigationExtras = {
        queryParams: { 'page': "" }
      };
      this.router.navigate(['ws/dashboard'], navigationExtras);
      this.authService.setUserValidity(true);
      this.authService.getAllProfiles();
    } else {
      if (input.inputUsername != "" && input.inputPassword != "") {
        this.authService.loginUser(input)
          .subscribe(data => {
            if (data.status) {
              // debugger;
              this.authService.setAuthToken(data.data);
              let navigationExtras: NavigationExtras = {
                queryParams: { 'page': "" }
              };
              this.router.navigate(['ws/dashboard'], navigationExtras);
              this.authService.setUserValidity(true);
              this.authService.getAllProfiles();
            } else {
              this.errorMessage = "Incorrect Username or Password.";
              this.inputCredentials.inputUsername = "";
              this.inputCredentials.inputPassword = "";
              $('#username').focus();
            }
          });
      } else {
        this.errorMessage = "Username & Password is required";
        this.inputCredentials.inputUsername = "";
        this.inputCredentials.inputPassword = "";
      }
    }
  }

  private navigatePage() {
    this.router.navigate(['signup']);
  }

}
