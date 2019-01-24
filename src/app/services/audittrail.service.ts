import { Injectable } from '@angular/core';
import { MyFolders } from '../../assets/data/myfolders';
import { HttpClient, HttpEvent, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { IFilemanager, FileTemplate, UploadTemplate, AuditLog } from '../filemanager';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable()
export class AuditTrailService {
    constructor(private http: HttpClient, private authService: AuthService) { }

    private requestOptions;
    private requestParams;

    private _url_auditTrailService = "http://dmsuat.eastasia.cloudapp.azure.com/filemanagement/filemanager/api/auditTrail/";

    private _headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + this.authService.getAuthToken()
    };

    public getAuditTrailContent() {
        this.requestOptions = {
            params: this.requestParams,
            headers: new HttpHeaders(this._headers)
        };
        return this.http.get<AuditLog[]>(this._url_auditTrailService, this.requestOptions);
    }

    public addAudiTrailLog(log: string) {
        this.requestOptions = {
            headers: new HttpHeaders(this._headers)
        };

        let newLog = new AuditLog();
        newLog.logs = log;

        this.http.post<AuditLog>(this._url_auditTrailService, newLog, this.requestOptions)
            .subscribe(data => {
                console.log("Log recorded: " + log);
            });
    }
}
