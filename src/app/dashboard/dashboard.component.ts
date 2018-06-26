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
  itemLoading = '';

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
    // console.log(this.allFilesFolders);
  }

  private getAllItems() {
    this.myContentService.getAllFolders()
      .subscribe(data => {
        this.populateItems(data);
      });
  }

  private getAllItemsForPage(folderID) {
    this.itemLoading = folderID;
    this.myContentService.getItemsInFolder(folderID)
      .subscribe(data => {
        this.populateItems(data);
        this.itemLoading = '';
      });
  }

  changeContentLayout = function (layout) {
    this.layout = layout;
  };

  openContentItem = function (item, e) {
    // debugger;
    if (e.target.className.split(' ')[0] !== 'ws-content-more-ops') {
      if (item.category === 'folder') {
        // debugger
        this.myContentService.setCurrentFolder(item.uniqueName);
        this.getAllItemsForPage(item.uniqueName);
      } else {
        // debugger
        this.itemLoading = item.uniqueName;
        for (let i = 0; i < this.allFilesFolders.length; i++) {
          if (this.allFilesFolders[i].id === item.id) {
            const count = i;
            this.myContentService.getItemToDisplay(item.uniqueFileName)
              .subscribe((resp: HttpResponse<Blob>) => {
                const headers = resp.headers;
                // console.log(headers); //<--- Check log for content disposition
                const contentDisposition = headers.get('Content-Disposition');
                // console.log(resp.headers.get('Content-Disposition'));
                this.selectedContentItem = this.allFilesFolders[count];
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
