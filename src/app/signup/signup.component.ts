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

  ngOnInit() {
  }

  signupUser() {
    debugger
    this.authService.signUpUser(this.newUserDetails)
      .subscribe(data => {
        alert("new user was created");
        this.navigatePage();
      });
  }

  navigatePage() {
    this.router.navigate(['auth']);
  }
}
