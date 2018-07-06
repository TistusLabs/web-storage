import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { userObject } from '../filemanager';
import { AuthService } from '../services/auth.service';
//import 'rxjs/add/operator/map';

@Component({
  selector: 'app-audittrail',
  templateUrl: './audittrail.component.html',
  styleUrls: ['./audittrail.component.scss']
})
export class AudittrailComponent implements OnDestroy, OnInit {

  dtOptions: DataTables.Settings = {};
  persons: userObject[] = [];
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger = new Subject();

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.loadAllUsers();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  private loadAllUsers() {
    this.authService.getAllUsers().subscribe(userdetails => {
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
