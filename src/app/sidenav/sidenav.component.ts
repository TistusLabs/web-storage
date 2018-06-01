import { Component, OnInit } from '@angular/core';
import { MyContentService } from  '../services/mycontent.service';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
    constructor(public myContentService: MyContentService) { }
    myFolders = null;

    ngOnInit() {
        this.myFolders = this.myContentService.getAllFolders();
    }

}
