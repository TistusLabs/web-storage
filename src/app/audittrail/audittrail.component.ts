import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { userObject, AuditLog } from '../filemanager';
import { AuthService } from '../services/auth.service';
import { AuditTrailService } from '../services/audittrail.service';
//import 'rxjs/add/operator/map';

@Component({
  selector: 'app-audittrail',
  templateUrl: './audittrail.component.html',
  styleUrls: ['./audittrail.component.scss']
})
export class AudittrailComponent implements OnDestroy, OnInit {

  dtOptions: DataTables.Settings = {};
  persons: userObject[] = [];
  auditlogs: AuditLog[] = [];
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger = new Subject();

  constructor(private authService: AuthService, private auditTrailService: AuditTrailService) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.loadAuditTrailDetails();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  private loadAuditTrailDetails() {
    this.auditTrailService.getAuditTrailContent().subscribe(logs => {
      this.auditlogs = new Array<AuditLog>();
      for (const log of Object.keys(logs)) {
        let newlog = <AuditLog>{};
        newlog.id = logs[log].id;
        newlog.userId = logs[log].userId;
        newlog.userRole = logs[log].userRole;
        newlog.logs = logs[log].logs;
        newlog.createdDate = logs[log].createdDate;
        this.auditlogs.push(newlog);
      }
      // Calling the DT trigger to manually render the table
      this.dtTrigger.next();
    });
  }

  private loadAllUsers() {
    this.authService.getAllProfiles().subscribe(userdetails => {
      this.persons = new Array<userObject>();
      for (const user of Object.keys(userdetails)) {
        let newuser = <userObject>{};
        newuser.userId = userdetails[user].userId;
        newuser.username = userdetails[user].username;
        newuser.userType = userdetails[user].userType;
        this.persons.push(newuser);
      }
      // Calling the DT trigger to manually render the table
      this.dtTrigger.next();
    });
  }

}
