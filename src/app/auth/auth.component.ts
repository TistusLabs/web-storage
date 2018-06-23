import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from "@angular/router";

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

  login = function (input) {
    //debugger
    if (input.inputUsername != "" && input.inputPassword != "") {
      this.authService.loginUser(input)
        .subscribe(data => {
          if (data.status) {
            this.authService.setAuthToken(data.data);
            this.router.navigate(['ws/dashboard']);
            this.authService.setUserValidity(true);
          } else {
            this.errorMessage = "Incorrect Username or Password.";
          }
        });
    } else {
      this.errorMessage = "Username & Password is required";
    }
  }

  private navigatePage() {
    this.router.navigate(['signup']);
  }

}
