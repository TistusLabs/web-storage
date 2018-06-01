import { Injectable } from '@angular/core';
import { MyFolders } from '../../data/myfolders';

interface myData {
    obj : Object
}

@Injectable()
export class MyContentService {
    constructor() {}

    myFolders = MyFolders;

    getAllFolders() {
        return this.myFolders;
    }

    addNewFolder() {
       this.myFolders.push({
           name : 'Folder 1',
           id : 'folder1',
           created_date: '23-05-2018'
       });
    }

    addNewFile() {
        document.getElementById('newFile').click();
    }
}