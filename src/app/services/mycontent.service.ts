import { Injectable } from '@angular/core';
import { MyFolders } from '../../assets/data/myfolders';
import { HttpClient } from '@angular/common/http';
import { IFilemanager } from '../filemanager';
import { Observable } from 'rxjs';
import { RequestOptions, Request, RequestMethod, Headers } from '@angular/http';
import { HttpParams } from "@angular/common/http";

interface myData {
    obj: Object
}

@Injectable()
export class MyContentService {
    constructor(private http: HttpClient) { }

    myFolders = MyFolders;
    requestOptions;
    requestParams;

    // headerDict = {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json',
    //     'Access-Control-Allow-Headers': '*',
    //     'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6InJ1Y2hpcmE2IiwibmFtZWlkIjoiMSIsInJvbGUiOiJhZG1pbiIsInBlcm1pc3Npb24iOiJ7XCJJZFwiOjEsXCJ1c2VySWRcIjoxLFwiY2FuRWRpdFwiOmZhbHNlLFwiY2FuVmlld1wiOmZhbHNlLFwiY2FuRG93bmxvYWRcIjpmYWxzZSxcImNhbkFkZFwiOmZhbHNlLFwiY2FuRGVsZXRlXCI6ZmFsc2V9IiwibmJmIjoxNTI5NDA1NDAxLCJleHAiOjE1Mjk0OTE4MDEsImlhdCI6MTUyOTQwNTQwMSwiaXNzIjoic2VsZiIsImF1ZCI6ImxvY2FsaG9zdCJ9.GCZaQsZbJxkB_D78Iky9ypQpsdPm4JUw4cP85_8Vzqs"
    // }

    // requestOptions = {
    //     headers: new Headers(this.headerDict),
    // }

    private _url = "http://104.196.2.1/filemanagement/filemanager/filemanager/getitems";

    getAllFolders(): Observable<IFilemanager> {

        this.requestParams = new HttpParams()
            .set('userId', '1')
            .set('folder', "");

        this.requestOptions = new RequestOptions({
            method: RequestMethod.Get,
            url: this._url,
            params : this.requestParams,
            headers: new Headers({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': '*',
                'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6InJ1Y2hpcmE2IiwibmFtZWlkIjoiMSIsInJvbGUiOiJhZG1pbiIsInBlcm1pc3Npb24iOiJ7XCJJZFwiOjEsXCJ1c2VySWRcIjoxLFwiY2FuRWRpdFwiOmZhbHNlLFwiY2FuVmlld1wiOmZhbHNlLFwiY2FuRG93bmxvYWRcIjpmYWxzZSxcImNhbkFkZFwiOmZhbHNlLFwiY2FuRGVsZXRlXCI6ZmFsc2V9IiwibmJmIjoxNTI5NDA1NDAxLCJleHAiOjE1Mjk0OTE4MDEsImlhdCI6MTUyOTQwNTQwMSwiaXNzIjoic2VsZiIsImF1ZCI6ImxvY2FsaG9zdCJ9.GCZaQsZbJxkB_D78Iky9ypQpsdPm4JUw4cP85_8Vzqs"
            })
        });

        //return this.myFolders;
        return this.http.get<IFilemanager>(this.requestOptions);
    }

    addNewFolder(folderdata) {
        this.myFolders.push({
            name: folderdata.name,
            id: 'ws' + folderdata.name.toLowerCase().trim(),
            created_date: '23-05-2018'
        });
        $("#initNewFolder").modal('hide');
    }

    addNewFile() {
        document.getElementById('newFile').click();
    }
}
