import { Component, OnInit } from '@angular/core';
import { MyContentService } from '../services/mycontent.service';
import { Router, NavigationExtras } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  constructor(public myContentService: MyContentService, private router: Router, private authService: AuthService) { }
  myFolders = null;
  xsBreadcrumbInfo = {
    selectedSection: 'Choose sections here',
    selectedFolder: '',
    icon: ''
  };
  xsSidenavState = false;
  authPermissions = {};

  ngOnInit() {
    this.myContentService.getAllFolders()
      .subscribe(data => {
        this.myFolders = data;
        // console.log(this.myFolders);
      });
    // this.myFolders = this.myContentService.getAllFolders();
    this.authPermissions = this.authService.getAuthPermissions();
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
      this.xsBreadcrumbInfo.selectedSection = advance;
      this.router.navigate([route], navigationExtras);
    } else {
      this.router.navigate([route]);
    }
  }

  toggleBreadcrumb() {
    this.xsSidenavState = !this.xsSidenavState;
    this.xsSidenavState ? $(".ws-sidenav-wrap").css({'height':'300px', 'overflow-y':'scroll'}) : $(".ws-sidenav-wrap").css({'height':'40px','overflow-y':'hidden'});
  }
}
