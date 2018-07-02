import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContentItems } from '../../assets/data/content';
import { MyContentService } from '../services/mycontent.service';
import { Router, ActivatedRoute, NavigationExtras, NavigationEnd } from '@angular/router';
import { IFilemanager } from '../filemanager';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  navigationSubscription;
  allFilesFolders = [];
  content;
  layout = 'carded';
  isContentItemFull = false;
  fullViewPos = '';
  selectedContentItem = {};
  imageToShow: any;
  itemLoading: "";
  pageData: Observable<string>;
  pageID = "";
  form: FormGroup;
  allusers = [];

  constructor(
    private myContentService: MyContentService,
    private authService: AuthService,
    private actrouter: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.authService.getAllUsers().subscribe(userdetails => {
      //debugger
      this.allusers = userdetails;
      const controls = this.allusers.map(c => new FormControl(false));
      // controls[0].setValue(true); // Set the first checkbox to true (checked)
  
      this.form = this.fb.group({
        usercontrollers: new FormArray(controls)
      });
    });
  }

  ngOnInit() {
    // this.pageData = this.router
    //   .queryParamMap
    //   .pipe(map(params => params.get('page') || ''));
    // this.pageData.subscribe(data => {
    //   this.pageID = data;
    // })
    // this.myContentService.setCurrentFolder(this.pageID);
    // // this.getAllItems();
    // this.getAllItemsForPage(this.pageID);

    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });
    this.actrouter.queryParams.subscribe(params => {
      this.pageID = params.page;
      this.getcontentforPage(this.pageID);
    });
  }

  initialiseInvites() {
    this.actrouter.queryParams.subscribe(params => {
      this.pageID = params.page;
      this.getcontentforPage(this.pageID);
    });
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  submit() {
    alert("submitted, check console");
    const selectedOrderIds = this.form.value.orders
      .map((v, i) => v ? this.allusers[i].username : null)
      .filter(v => v !== null);
    console.log(selectedOrderIds);
  }

  private getcontentforPage = function (page) {
    this.myContentService.setCurrentFolder(page);
    this.getAllItemsForPage(page);
  }

  private populateItems(items) {
    this.allFilesFolders = [];
    for (const folder of items.folders) {
      folder.id = folder.folderId;
      folder.name = folder.folderName;
      folder.category = 'folder';
      folder.icon = 'folder';
      folder.added_date = '20 May 2018';
      folder.size = 1000;
      this.allFilesFolders.push(folder);
    }
    for (const file of items.files) {
      file.id = file.id;
      file.name = file.filename;
      file.category = 'image';
      file.icon = 'image';
      file.added_date = '21 May 2018';
      file.size = 1000;
      this.allFilesFolders.push(file);
    }
    this.content = this.allFilesFolders;
    this.itemLoading = '';
    // console.log(this.allFilesFolders);
  }

  private getAllItems() {
    this.myContentService.getAllFolders()
      .subscribe(data => {
        this.populateItems(data);
      });
  }

  private getAllItemsForPage(folderID: string) {
    this.myContentService.getItemsInFolder(folderID)
      .subscribe(data => {
        this.populateItems(data);
      });
  }

  changeContentLayout = function (layout) {
    this.layout = layout;
  };

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageToShow = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  openContentItem = function (item, e) {
    // debugger
    if (e.target.className.split(' ')[0] != 'ws-content-more-ops') {
      if (item.category == "folder") {
        // debugger
        this.itemLoading = item.id;
        this.goToRoute(item.uniqueName);
      } else {
        //debugger
        this.imageToShow = Object;
        this.itemLoading = item.id;
        for (var i = 0; i < this.allFilesFolders.length; i++) {
          if (this.allFilesFolders[i].id == item.id) {
            const count = i;
            this.myContentService.getItemToDisplay(item.uniqueFileName)
              .subscribe((resp: HttpResponse<Blob>) => {
                //debugger
                console.log("Item to display:", this.allFilesFolders[count]);
                this.selectedContentItem = this.allFilesFolders[count];
                this.createImageFromBlob(resp);
                // this.selectedContentItem.filedata = data;
                this.isContentItemFull = true;
                this.itemLoading = '';
              });
          }
        }
        // this.fullViewPos = 'width:100%;height:100%';
      }
    }
  };

  goToRoute = function (route) {
    let navigationExtras: NavigationExtras = {
      queryParams: { 'page': route }
    };
    this.router.navigate(['ws/dashboard'], navigationExtras);
  }

  closeContentFull = function () {
    this.isContentItemFull = false;
  };

}
