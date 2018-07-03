import { Component, OnInit } from '@angular/core';
import { MyContentService } from '../services/mycontent.service';
import { Router, NavigationExtras } from '@angular/router';

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
        // console.log(this.myFolders);
      });
    // this.myFolders = this.myContentService.getAllFolders();
  }

  getFolders = function () {
    this.myContentService.getAllFolders()
      .subscribe(data => {
        this.populateItems(data);
      });
  }

  goToRoute = function (route, advance) {
    // debugger
    if (route === '/ws/dashboard') {
      let navigationExtras: NavigationExtras = {
        queryParams: { 'page': advance }
      };
      this.router.navigate([route], navigationExtras);
    } else {
      this.router.navigate([route]);
    }
  }
}
