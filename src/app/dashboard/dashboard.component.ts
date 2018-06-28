import { Component, OnInit } from '@angular/core';
import { ContentItems } from '../../assets/data/content';
import { MyContentService } from '../services/mycontent.service';
import { Router } from '@angular/router';
import { IFilemanager } from '../filemanager';
import { HttpParams, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(
    public myContentService: MyContentService,
    private router: Router) { }

  allFilesFolders = [];
  content;
  layout = 'carded';
  isContentItemFull = false;
  fullViewPos = '';
  selectedContentItem = {};
  imageToShow: any;
  itemLoading: "";

  ngOnInit() {
    this.myContentService.setCurrentFolder('');
    this.getAllItems();
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

  private getAllItemsForPage(folderID) {
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
    //debugger
    if (e.target.className.split(' ')[0] != 'ws-content-more-ops') {
      if (item.category == "folder") {
        // debugger
        this.itemLoading = item.uniqueName;
        this.myContentService.setCurrentFolder(item.uniqueName);
        this.getAllItemsForPage(item.uniqueName);
      } else {
        //debugger
        this.imageToShow = Object;
        this.itemLoading = item.uniqueName;
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

  closeContentFull = function () {
    this.isContentItemFull = false;
  };

}
