import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';
import { ActivitiesService } from 'src/app/service/activities/activities.service';
@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.css'],
})
export class ActivityLogComponent implements OnInit {
  page = 1;
  limit = 10;
  skip = 0;
  count: number = 0;
  activityData: any[] = [];

  constructor(private group: ActivitiesService) {}
  findAll() {
    this.skip = this.limit * (this.page - 1);
    this.group.findAll(this.skip, this.limit).subscribe((data: any) => {
      this.activityData = data.results;
      this.count = data.count;
    });
  }

  changePageLimit() {
    this.skip = 0;
    this.findAll();
  }
  delete(id: any) {
    if (confirm('delete?')) {
      this.group.Removedata(id).subscribe((data) => {
        this.findAll();
      });
    }
  }
  ngOnInit() {
    this.findAll();
  }
}
