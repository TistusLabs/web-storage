import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../assets/data/user';
import { Observable } from 'rxjs';

interface myData {
  obj : Object
}

@Injectable()
export class AuthService {
  constructor( private http: HttpClient) {}

  // user = User;
  private url: string = '/assets/data/dummy.json';
  private isUserValid = false;

  get userValidity() {
    return this.isUserValid;
  }

  setUserValidity = function (state) {
    this.isUserValid = state;
  };

  getUser(): Observable<User[]> {
    return this.http.get<User[]>(this.url)
  }
}
