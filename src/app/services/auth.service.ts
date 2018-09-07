import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { User } from '../../assets/data/user';
import { Observable, throwError } from 'rxjs';
import {
    NewUserTemplate,
    loginResponse,
    userObject,
    userPermissionObject,
    profileObject,
    FileTemplate
} from '../filemanager';
import { retry, catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router, NavigationExtras } from '@angular/router';

interface myData {
    obj: Object
}

@Injectable()
export class AuthService {
    constructor(private http: HttpClient, private router: Router) { }

    // user = User;
    private url: string = '/assets/data/dummy.json';
    private isUserValid = false;
    private requestOptions;
    private requestParams;
    private newUserDetails;
    private newUserPermissions;
    private newUserObject;
    private authObject;
    private authToken;
    private allUsers;
    private authPermissions;
    private profileDetails;

    private _url_createuser = "http://104.196.2.1/filemanagement/user_management/users/registration";
    private _url_loginuser = "http://104.196.2.1/filemanagement/user_management/users/login/";
    private _url_getAllusers = "http://104.196.2.1/filemanagement/user_management/profile/getAllProfile";
    private _url_getAllUsersSub = "http://104.196.2.1/filemanagement/user_management/users/getAll/";
    private _url_saveProfile = "http://104.196.2.1/filemanagement/user_management/profile/saveProfile";
    private _url_getProfile = "http://104.196.2.1/filemanagement/user_management/profile/getProfile";
    private _url_updateUser = "http://104.196.2.1/filemanagement/user_management/users/updateUser";
    private _url_getUserPremission = "http://104.196.2.1/filemanagement/user_management/permission/getPermission";

    private _headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*'
    };

    public setAuthToken(token) {
        this.authToken = token;
        const helper = new JwtHelperService();
        this.authObject = helper.decodeToken(token);
        this.setAuthPermissions(this.authObject.permission);
        this.getProfile(this.authObject.nameid).subscribe(data => {
            this.profileDetails = data;
        });
    }

    private setAuthPermissions(stringJSON) {
        let jsObj = JSON.parse(stringJSON);
        this.authPermissions = jsObj;
        this.authPermissions.role = this.authObject.role;
    }

    public getAuthPermissions() {
        return this.authPermissions;
    }

    public getAuthToken() {
        return this.authToken;
    }

    public getAuthObject() {
        return this.authObject;
    }

    public getProfileData() {
        return this.profileDetails;
    }

    public logoutUser() {
        this.authToken = "";
        this.authObject = {};
        let navigationExtras: NavigationExtras = {
            queryParams: {}
        };
        this.router.navigate(['auth'], navigationExtras);
    }

    public getUserID() {
        return this.authObject.nameid;
    }

    get userValidity() {
        return this.isUserValid;
    }

    setUserValidity = function (state) {
        this.isUserValid = state;
    };

    getUser(): Observable<User[]> {
        return this.http.get<User[]>(this.url)
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError(
            'Something bad happened; please try again later.');
    };

    public signUpUser(userdata: any): Observable<HttpEvent<NewUserTemplate>> {
        this.requestOptions = {
            headers: new HttpHeaders(this._headers)
        };

        this.newUserDetails = {};
        this.newUserDetails.username = userdata.user.username;
        this.newUserDetails.password = userdata.user.password;
        this.newUserDetails.userType = userdata.user.userType;

        this.newUserPermissions = {};
        this.newUserPermissions.canEdit = userdata.permissions.canEdit;
        this.newUserPermissions.canView = userdata.permissions.canView;
        this.newUserPermissions.canDownload = userdata.permissions.canDownload;
        this.newUserPermissions.canAdd = userdata.permissions.canAdd;
        this.newUserPermissions.canDelete = userdata.permissions.canDelete;
        this.newUserPermissions.createFolder = userdata.permissions.createFolder;

        this.newUserObject = {};
        this.newUserObject.user = this.newUserDetails;
        this.newUserObject.permission = this.newUserPermissions;

        return this.http.post<NewUserTemplate>(this._url_createuser, this.newUserObject, this.requestOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    public saveProfile(formData: FormData) {

        formData.append('authorize', this.getAuthToken());
        const jwt = this.extractToken();
        return this.http.post<profileObject>(this._url_saveProfile + '?userId=' + jwt.nameid, formData)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    public getProfile(userid) {
        const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Authorization': "Bearer " + this.getAuthToken()
        };

        this.requestParams = new HttpParams()
            .set('userId', userid);

        this.requestOptions = {
            params: this.requestParams,
            headers: new HttpHeaders(headers)
        };

        return this.http.get<profileObject>(this._url_getProfile, this.requestOptions);
    }

    public loginUser(userdata: any): Observable<HttpEvent<loginResponse>> {
        this.requestOptions = {
            headers: new HttpHeaders(this._headers)
        };

        this.newUserDetails = {};
        this.newUserDetails.username = userdata.inputUsername;
        this.newUserDetails.password = userdata.inputPassword;

        //debugger

        return this.http.post<loginResponse>(this._url_loginuser, this.newUserDetails, this.requestOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    public getAllUsers() {

        const headers = {
            'Authorization': "Bearer " + this.getAuthToken()
        };

        this.requestOptions = {
            headers: new HttpHeaders(headers)
        };
        return this.http.get<userObject>(this._url_getAllusers, this.requestOptions);
    }

    public getAllUsersSub() {

        const headers = {
            'Authorization': "Bearer " + this.getAuthToken()
        };

        this.requestOptions = {
            headers: new HttpHeaders(headers)
        };
        return this.http.get(this._url_getAllUsersSub, this.requestOptions);
    }


    public setUsers(users) {
        this.allUsers = users;
    }

    public getUsers() {
        return this.allUsers;
    }

    public updateUser(userid: string, username: string, password: string) {
        const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Authorization': "Bearer " + this.getAuthToken()
        };

        this.requestParams = new HttpParams()
            .set('id', userid);

        this.requestOptions = {
            params: this.requestParams,
            headers: new HttpHeaders(headers)
        };

        let sendObj = {
            "username": username,
            "password": password,
            "userType":1,
            "userId":userid
        };

        return this.http.put<Blob>(this._url_updateUser, sendObj, this.requestOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    public getProfileInfo(userid: string) {
        const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Authorization': "Bearer " + this.getAuthToken()
        };

        this.requestParams = new HttpParams()
            .set('userId', userid);

        this.requestOptions = {
            params: this.requestParams,
            headers: new HttpHeaders(headers)
        };

        return this.http.get<profileObject>(this._url_getProfile, this.requestOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    public extractToken() {
        const token = this.getAuthToken();
        const helper = new JwtHelperService();
        return helper.decodeToken(token);
    }

    public getUserPermission(userid: string) {
        const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Authorization': "Bearer " + this.getAuthToken()
        };

        this.requestParams = new HttpParams()
            .set('id', userid);

        this.requestOptions = {
            params: this.requestParams,
            headers: new HttpHeaders(headers)
        };

        return this.http.get<userPermissionObject>(this._url_getUserPremission, this.requestOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }
}
