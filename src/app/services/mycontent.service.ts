import { Injectable } from '@angular/core';
import { MyFolders } from '../../assets/data/myfolders';

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

    addNewFolder(folderdata) {
       this.myFolders.push({
           name : folderdata.name,
           id : 'ws'+ folderdata.name.toLowerCase().trim(),
           created_date: '23-05-2018'
       });
        $("#initNewFolder").modal('hide');
    }

    addNewFile() {
        document.getElementById('newFile').click();
    }
}
