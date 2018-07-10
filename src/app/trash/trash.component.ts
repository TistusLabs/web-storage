import { Component, OnInit } from '@angular/core';
import { MyContentService } from '../services/mycontent.service';
import { IFilemanager } from '../filemanager';
import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuditTrailService } from '../services/audittrail.service';
import { UIHelperService } from '../services/uihelper.service';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.scss']
})
export class TrashComponent implements OnInit {

  constructor(
    private myContentService: MyContentService,
    private auditTrailService: AuditTrailService,
    private uiHelperService: UIHelperService) { }

  alldeletedFilesFolders = new Array<IFilemanager>();
  itemsLoading = false;
  itemsLayout = 'grid';

  ngOnInit() {
    this.getDeletedItems();
    this.uiHelperService.itemsLayoutEmitter.subscribe(il => {
      this.itemsLayout = il;
    });
  }

  populateitems(data) {
    for (const folder of data.folders) {
      folder.id = folder.folderId;
      folder.name = folder.folderName;
      folder.starred = folder.starred;
      folder.category = 'folder';
      folder.icon = 'folder';
      folder.added_date = '20 May 2018';
      folder.size = 1000;
      this.alldeletedFilesFolders.push(folder);
    }
    for (const file of data.files) {
      file.id = file.id;
      file.name = file.filename;
      file.starred = file.starred;
      file.category = 'image';
      file.icon = 'image';
      file.added_date = '21 May 2018';
      file.size = 1000;
      this.alldeletedFilesFolders.push(file);
    }
    this.itemsLoading = false;
  }

  private getDeletedItems() {
    this.itemsLoading = true;
    this.alldeletedFilesFolders = new Array<IFilemanager>();
    this.myContentService.getDeletedItems()
      .subscribe(data => {
        this.populateitems(data);
      });
  }

  private permanentDelete(item) {
    if (confirm("Do you want to permamnetly delete this file/folder from the system? Please not that this is irreversible.")) {
      if (item.category != "folder") {
        this.myContentService.deletePermanentFile([item.id], [])
          .subscribe(data => {
            this.auditTrailService.addAudiTrailLog("File '" + item.name + "' deleted permanently.");
            this.getDeletedItems();
          });
      } else if (item.category == "folder") {
        this.myContentService.deletePermanentFile([], [item.id])
          .subscribe(data => {
            this.auditTrailService.addAudiTrailLog("Folder '" + item.name + "' deleted permanently.");
            this.getDeletedItems();
          });
      }
    }
  }
}
