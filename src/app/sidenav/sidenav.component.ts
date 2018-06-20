import { Component, OnInit } from '@angular/core';
import { MyContentService } from '../services/mycontent.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  constructor(public myContentService: MyContentService, private router: Router) { }
  myFolders = null;

  ngOnInit() {
    this.myContentService.getAllFolders()
      .subscribe(data => {
        this.myFolders = data;
        console.log(this.myFolders);
      });
    //this.myFolders = this.myContentService.getAllFolders();
  }

  getFolders = function () {
    this.router.navigate(['ws/dashboard']);
  }
}
