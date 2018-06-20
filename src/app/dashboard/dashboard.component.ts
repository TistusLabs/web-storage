import { Component, OnInit } from '@angular/core';
import { ContentItems } from '../../assets/data/content';
import { MyContentService } from '../services/mycontent.service';
import { Router } from '@angular/router';
import { IFilemanager } from '../filemanager';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(public myContentService: MyContentService, private router: Router) { }

  allFilesFolders = [];
  content;
  layout = 'carded';
  isContentItemFull = false;
  fullViewPos = '';
  selectedContentItem = {};

  ngOnInit() {
    this.myContentService.setCurrentFolder("");
    this.getAllItems();
  }

  private populateItems(items) {
    this.allFilesFolders = [];
    for (let folder of items.folders) {
      folder.category = "folder";
      folder.icon = "folder";
      folder.added_date = "20 May 2018";
      folder.size = 1000;
      this.allFilesFolders.push(folder);
    }
    this.content = this.allFilesFolders;
    console.log(this.allFilesFolders);
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

  openContentItem = function (item, e) {
    if (item.category = "folder") {
      debugger
      this.myContentService.setCurrentFolder(item.uniqueName);
      this.getAllItemsForPage(item.uniqueName);
    } else {
      if (e.target.className.split(' ')[0] != 'ws-content-more-ops') {
        this.isContentItemFull = true;
        for (var i = 0; i < this.allFilesFolders.length; i++) {
          if (this.allFilesFolders[i].folderId == item.folderId)
            this.selectedContentItem = this.allFilesFolders[i];
        }
        // this.fullViewPos = 'width:100%;height:100%';
      }
    }
  };

  closeContentFull = function () {
    this.isContentItemFull = false;
  };

}
