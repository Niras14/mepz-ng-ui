import { Component, OnInit } from '@angular/core';
import { EquipmentService } from 'src/app/service/equipment/equipment.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-equipment-detail',
  templateUrl: './equipment-detail.component.html',
  styleUrls: ['./equipment-detail.component.css'],
})
export class EquipmentDetailComponent implements OnInit {
  [x: string]: any;
  page = 1;
  limit = 10;
  skip = 0;
  count: number = 0;
  equipmentData: any[] = []; //Equipment data list in sidebar

  constructor(
    private equipmentService: EquipmentService,
    private http: HttpClient) {
    this.Load();
  }

  ngOnInit() {
    // this.Load();
    // this.loadEquipmentData() //Equipment data list in sidebar
  }

  // Load equipmentData from the server | List in Sidebar
  loadEquipmentData(): void {
    this.equipmentService.Load(0, 10).subscribe((data: any) => {
      this.equipmentData = data.results;
    });
  }

  Load() {
    this.skip = this.limit * (this.page - 1);
    this.equipmentService.Load(this.skip, this.limit).subscribe((data: any) => {
      this.equipmentData = data.results;
      this.count = data.count;
    });
  }

  delete(id: any) {
    if (confirm('delete?')) {
      this.equipmentService.Removedata(id).subscribe((data) => {
        this.Load();
      });
    }
  }
}
