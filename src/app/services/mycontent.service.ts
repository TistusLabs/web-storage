import { Injectable } from '@angular/core';
import { MyFolders } from '../../assets/data/myfolders';
import { HttpClient, HttpEvent, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { IFilemanager, FileTemplate } from '../filemanager';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpParams } from "@angular/common/http";

interface myData {
    obj: Object
}

@Injectable()
export class MyContentService {
    constructor(private http: HttpClient) { }

    private myFolders = MyFolders;
    private requestOptions;
    private requestParams;
    private newFolderDetails;

    private _url_getitems = "http://104.196.2.1/filemanagement/filemanager/filemanager/getitems";
    private _url_createfolder = "http://104.196.2.1/filemanagement/filemanager/filemanager/createfolder";
    private _token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6InJ1Y2hpcmE2IiwibmFtZWlkIjoiMSIsInJvbGUiOiJhZG1pbiIsInBlcm1pc3Npb24iOiJ7XCJJZFwiOjEsXCJ1c2VySWRcIjoxLFwiY2FuRWRpdFwiOmZhbHNlLFwiY2FuVmlld1wiOmZhbHNlLFwiY2FuRG93bmxvYWRcIjpmYWxzZSxcImNhbkFkZFwiOmZhbHNlLFwiY2FuRGVsZXRlXCI6ZmFsc2V9IiwibmJmIjoxNTI5NDc0NDYxLCJleHAiOjE1Mjk1NjA4NjEsImlhdCI6MTUyOTQ3NDQ2MSwiaXNzIjoic2VsZiIsImF1ZCI6ImxvY2FsaG9zdCJ9.-GLBCU2oyReHfnJD77oROYn2nVRq3O6J4yAgMBuSP8w";
    private _userID = "1";
    private _headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
        'Authorization': "Bearer " + this._token
    };

    private currentFolderSource = new BehaviorSubject('default message');
    private currentFolder = this.currentFolderSource.asObservable();

    public setCurrentFolder(folderID: string) {
        this.currentFolderSource.next(folderID);
    }

    public getCurrenFolder(){
        return this.currentFolderSource;
    }

    public getAllFolders(): Observable<HttpEvent<IFilemanager>> {

        this.requestParams = new HttpParams()
            .set('userId', this._userID)
            .set('folder', "");

        this.requestOptions = {
            params: this.requestParams,
            headers: new HttpHeaders(this._headers)
        };
        return this.http.get<IFilemanager>(this._url_getitems, this.requestOptions);
    }

    public getItemsInFolder(folderID: string): Observable<HttpEvent<IFilemanager>> {

        this.requestParams = new HttpParams()
            .set('userId', this._userID)
            .set('folder', folderID);

        this.requestOptions = {
            params: this.requestParams,
            headers: new HttpHeaders(this._headers)
        };
        return this.http.get<IFilemanager>(this._url_getitems, this.requestOptions);
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

    public addNewFolder(folderdata: any): Observable<HttpEvent<FileTemplate>> {
        this.requestOptions = {
            params: this.requestParams,
            headers: new HttpHeaders(this._headers)
        };

        this.newFolderDetails = {};
        this.newFolderDetails.folderName = folderdata.name;
        this.newFolderDetails.userId = this._userID;
        this.newFolderDetails.parentFolder = "";

        return this.http.post<FileTemplate>(this._url_createfolder, this.newFolderDetails, this.requestOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    public addNewFile() {
        document.getElementById('newFile').click();
    }
}
