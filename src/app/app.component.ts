import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor() { }
  title = 'web-storage';
  ngOnInit() {
    window.localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImIiLCJuYW1laWQiOiI0NCIsInJvbGUiOiJhZG1pbiIsInBlcm1pc3Npb24iOiJ7XCJJZFwiOjQ0LFwidXNlcklkXCI6NDQsXCJjYW5FZGl0XCI6dHJ1ZSxcImNhblZpZXdcIjp0cnVlLFwiY2FuRG93bmxvYWRcIjp0cnVlLFwiY2FuQWRkXCI6dHJ1ZSxcImNhbkRlbGV0ZVwiOnRydWUsXCJjcmVhdGVGb2xkZXJcIjp0cnVlLFwiY2FuU2hhcmVcIjp0cnVlLFwiY2FuVW5TaGFyZVwiOnRydWV9IiwibmJmIjoxNTQwMjAwMjY3LCJleHAiOjE1NDAyODY2NjcsImlhdCI6MTU0MDIwMDI2NywiaXNzIjoic2VsZiIsImF1ZCI6ImxvY2FsaG9zdCJ9.xKOyEDqthvnxzUVlnr0nHvjljTD-iuzu2P8rCh3tlSI');
  }

}
