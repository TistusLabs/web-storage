import { Injectable } from '@angular/core';
import { MyFolders } from '../../assets/data/myfolders';
import { HttpClient, HttpEvent, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { IFilemanager, FileTemplate, UploadTemplate } from '../filemanager';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable()
export class MyContentService {
    constructor(private http: HttpClient, private authService: AuthService) { }

    private myFolders = MyFolders;
    private requestOptions;
    private requestParams;
    private newFolderDetails;
    private newFileDetails;
    private currentFolder: string;

    private _url_getitems = "http://104.196.2.1/filemanagement/filemanager/filemanager/getitems";
    private _url_createfolder = "http://104.196.2.1/filemanagement/filemanager/filemanager/createfolder";
    private _url_uploadfile = "http://104.196.2.1/filemanagement/filemanager/filemanager/uploadfile";
    private _url_getfile = "http://104.196.2.1/filemanagement/filemanager/filemanager/showfile";
    private _url_getfilenew = "http://104.196.2.1/filemanagement/filemanager/filemanager/getFile";
    private _url_sharefile = "http://104.196.2.1/filemanagement/filemanager/filemanager/sharefile";
    private _url_searchfile = "http://104.196.2.1/filemanagement/filemanager/filemanager/searchByName";
    private _url_updatefile = "http://104.196.2.1/filemanagement/filemanager/filemanager/updateFileName";
    private _url_updateFolder = "http://104.196.2.1/filemanagement/filemanager/filemanager/updateFolderName";
    private _url_deletefile = "http://104.196.2.1/filemanagement/filemanager/filemanager/deleteFile";
    private _url_deletefolder = "http://104.196.2.1/filemanagement/filemanager/filemanager/deleteFolder";
    private _url_starfile = "http://104.196.2.1/filemanagement/filemanager/filemanager/starred";
    private _url_unstarfile = "http://104.196.2.1/filemanagement/filemanager/filemanager/unstarred";
    //private _url_uploadfile = "https://f7c89f2a.ngrok.io/filemanager/uploadfile";
    // private _token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6InNoZWhhbiIsIm5hbWVpZCI6IjYiLCJyb2xlIjoiYWRtaW4iLCJwZXJtaXNzaW9uIjoie1wiSWRcIjo2LFwidXNlcklkXCI6NixcImNhbkVkaXRcIjpmYWxzZSxcImNhblZpZXdcIjpmYWxzZSxcImNhbkRvd25sb2FkXCI6ZmFsc2UsXCJjYW5BZGRcIjpmYWxzZSxcImNhbkRlbGV0ZVwiOmZhbHNlfSIsIm5iZiI6MTUyOTU5ODE5NSwiZXhwIjoxNTI5Njg0NTk1LCJpYXQiOjE1Mjk1OTgxOTUsImlzcyI6InNlbGYiLCJhdWQiOiJsb2NhbGhvc3QifQ.Z8A2KK5VI_cm9JgWkjdz4QWMqIoGmkBK4N1zokoz_WI";
    private _headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + this.authService.getAuthToken()
    };

    // private currentFolderSource = new BehaviorSubject('default message');
    // private currentFolder = this.currentFolderSource.asObservable();

    public setCurrentFolder(folderID: string) {
        this.currentFolder = folderID;
    }

    public getCurrenFolder() {
        return this.currentFolder;
    }

    public getAllFolders(): Observable<HttpEvent<IFilemanager>> {

        this.requestParams = new HttpParams()
            .set('userId', this.authService.getUserID())
            .set('folder', '');

        this.requestOptions = {
            params: this.requestParams,
            headers: new HttpHeaders(this._headers)
        };
        return this.http.get<IFilemanager>(this._url_getitems, this.requestOptions);
    }

    public getItemsInFolder(folderID: string): Observable<HttpEvent<IFilemanager>> {
        this.requestParams = new HttpParams()
            .set('userId', this.authService.getUserID())
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
    }

    public addNewFolder(folderdata: any): Observable<HttpEvent<FileTemplate>> {
        this.requestOptions = {
            headers: new HttpHeaders(this._headers)
        };

        this.newFolderDetails = {};
        this.newFolderDetails.folderName = folderdata.name;
        this.newFolderDetails.userId = this.authService.getUserID();
        this.newFolderDetails.parentFolder = this.getCurrenFolder();

        return this.http.post<FileTemplate>(this._url_createfolder, this.newFolderDetails, this.requestOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    public addNewFile(formData: FormData) {
        // document.getElementById('newFile').click();

        const headers = {
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + this.authService.getAuthToken()
        };

        this.requestOptions = {
            headers: new HttpHeaders(headers),
            reportProgress: true,
            observe: 'events'
        };

        formData.append('authorize', this.authService.getAuthToken());

        // this.newFileDetails = {};
        // this.newFileDetails.filename = filedata.filename;
        // this.newFileDetails.folderName = this.getCurrenFolder(); // get from service
        // this.newFileDetails.userId = this.authService.getUserID();
        // this.newFileDetails.upfile = filedata.upfile;

        return this.http.post(this._url_uploadfile, formData)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    public getItemToDisplay(uniqueFilename: string, userid: string): Observable<HttpEvent<Blob>> {

        const headers = {
            'Authorization': "Bearer " + this.authService.getAuthToken()
        };

        this.requestParams = new HttpParams()
            .set('userId', userid)
            .set('filename', uniqueFilename);

        this.requestOptions = {
            params: this.requestParams,
            headers: new HttpHeaders(headers),
            responseType: 'blob'
        };
        return this.http.get<Blob>(this._url_getfilenew, this.requestOptions);
    }

    public shareFileWithUser(uniqueFilename: string, userID: string) {

        const headers = {
            'Authorization': "Bearer " + this.authService.getAuthToken()
        };

        this.requestParams = new HttpParams()
            .set('shardeUserId', userID)
            .set('uniqueFileName', uniqueFilename);

        this.requestOptions = {
            params: this.requestParams,
            headers: new HttpHeaders(headers)
        };
        return this.http.get(this._url_sharefile, this.requestOptions);
    }

    public searchItems(query): Observable<HttpEvent<IFilemanager>> {
        this.requestParams = new HttpParams()
            .set('searchname', query)

        this.requestOptions = {
            params: this.requestParams,
            headers: new HttpHeaders(this._headers)
        };
        return this.http.get<IFilemanager>(this._url_searchfile, this.requestOptions);
    }

    public renameFile(newfilename: string, uniqueName: string) {

        this.requestParams = new HttpParams()
            .set('uniqueName', uniqueName)
            .set('newname', newfilename);

        this.requestOptions = {
            params: this.requestParams,
            headers: new HttpHeaders(this._headers)
        };

        let emptyObj = {};

        return this.http.post<FileTemplate>(this._url_updatefile, emptyObj, this.requestOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    public renameFolder(newfoldername: string, uniquefolderName: string) {

        this.requestParams = new HttpParams()
            .set('uniqueFolderName', uniquefolderName)
            .set('newname', newfoldername);

        this.requestOptions = {
            params: this.requestParams,
            headers: new HttpHeaders(this._headers)
        };

        let emptyObj = {};

        return this.http.post<FileTemplate>(this._url_updateFolder, emptyObj, this.requestOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    public deleteFile(uniquefileName: string) {

        this.requestParams = new HttpParams()
            .set('uniqueName', uniquefileName);

        this.requestOptions = {
            params: this.requestParams,
            headers: new HttpHeaders(this._headers)
        };

        let emptyObj = {};

        return this.http.post<FileTemplate>(this._url_deletefile, emptyObj, this.requestOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    public deleteFolder(uniquefileName: string) {

        this.requestParams = new HttpParams()
            .set('uniqueName', uniquefileName);

        this.requestOptions = {
            params: this.requestParams,
            headers: new HttpHeaders(this._headers)
        };

        let emptyObj = {};

        return this.http.post<FileTemplate>(this._url_deletefolder, emptyObj, this.requestOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    public starFile(fileid: number) {

        this.requestOptions = {
            headers: new HttpHeaders(this._headers)
        };

        let sendObj = { "files": [] };
        sendObj.files.push(fileid);

        return this.http.post<FileTemplate>(this._url_starfile, sendObj, this.requestOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    public unstarFile(fileid: number) {

        this.requestOptions = {
            headers: new HttpHeaders(this._headers)
        };

        let sendObj = { "files": [] };
        sendObj.files.push(fileid);

        return this.http.post<FileTemplate>(this._url_unstarfile, sendObj, this.requestOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }
}