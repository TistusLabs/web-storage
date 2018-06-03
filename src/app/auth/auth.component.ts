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
    if(input.inputUsername != "" && input.inputPassword != "") {
      this.authService.getUser()
        .subscribe(data=> {
          if(data.username === input.inputUsername) {
            if(data.password === input.inputPassword) {
              this.router.navigate(['ws/dashboard']);
              this.authService.setUserValidity(true);
            }else{
              this.errorMessage = "Your password is wrong";
            }
          }else{
            this.errorMessage = "Your username is wrong";
          }
        });
    }else{
      this.errorMessage = "Username & Password is required";
    }
  }

}
