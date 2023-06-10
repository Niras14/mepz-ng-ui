import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EquipmentService } from 'src/app/service/equipment/equipment.service';
import { RoomService } from 'src/app/service/room/room.service';
import { EquipmentAllocationModalComponent } from './equipment-allocation-modal/equipment-allocation-modal.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-rooms',
  templateUrl: './view-rooms.component.html',
  styleUrls: ['./view-rooms.component.css'],
})
export class ViewRoomsComponent {
  roomData: any[] = [];
  selectedQuantity: number = 0;
  selectedQuantity1: number = 0;
  item: any[] = [];
  selectOptions: any[] = [];
  selectedRooms: any[] = [];
  selectedEquipments: any[] = [];
  equipmentdata: any[] = []; //Equipment data list in sidebar
  selectedEquipment: any[] = [];
  projectId!: any;
  deptId!: any;
  roomId: any;
  searchTerm: string = ''; // For search bar
  filteredData: any[] = []; // For search bar

  constructor(
    private room: RoomService,
    private equipmentService: EquipmentService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
  ) {
    // For Qty dropdown: Creating options from 1 to 20
    for (let i = 1; i <= 20; i++) {
      this.selectOptions.push({ value: i.toString(), label: i.toString() });
    }
  }

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.deptId = this.route.snapshot.paramMap.get('deptId');
    this.loadRoomData(); // Loading room data
    this.loadSelectedRooms();
    this.loadEquipmentData(); //Equipment data list in sidebar
    this.loadSelectedEquipments();

    // Initializing DataTables and setting up callbacks
    // let table = $('#example').DataTable({
    //   drawCallback: () => {
    //     $('.paginate_button.next').on('click', () => {
    //       this.nextButtonClickEvent();
    //     });
    //   },
    // });

    let table1 = $('#example1').DataTable({
      drawCallback: () => {
        $('.paginate_button.next').on('click', () => {
          this.nextButtonClickEvent();
        });
      },
    });

    // let table2 = $('#example2').DataTable({
    //   drawCallback: () => {
    //     $('.paginate_button.next').on('click', () => {
    //       this.nextButtonClickEvent();
    //     });
    //   },
    // });
  }

  openEquipmentAllocationModal(roomId: string) {
    const modalRef = this.modalService.open(EquipmentAllocationModalComponent, { size: 'xl' });
    modalRef.componentInstance.projectId = this.projectId;
    modalRef.componentInstance.deptId = this.deptId;
    modalRef.componentInstance.roomId = roomId;
  }

  // Load equipment data from the service  | List in Sidebar
  loadEquipmentData(): void {
    this.equipmentService.Load(0, 10).subscribe((data: any) => {
      this.equipmentdata = data.results;
      this.filteredData = this.equipmentdata; //For search bar

    });
  }

  // For search bar | Filters the data based on the search term
  filterData() {
    if (!this.searchTerm) {
      this.filteredData = this.equipmentdata;
    } else {
      this.filteredData = this.equipmentdata.filter((room) =>
        this.matchesSearchTerm(room)
      );
    }
  }

  // For search bar | Checks if an item matches the search term
  matchesSearchTerm(room: any): boolean {
    const searchFields = [
      room.code,
      room.name,
    ];

    for (const field of searchFields) {
      if (field && field.toLowerCase().includes(this.searchTerm.toLowerCase())) {
        return true;
      }
    }

    return false;
  }

  // Function to save room data
  saveRoomData(): void {
    console.log('Save data method called');
    for (let i = 0; i < this.roomData.length; i++) {
      const selectedQuantity = this.roomData[i].selectedQuantity;
      if (selectedQuantity > 0) {
        for (let j = 0; j < selectedQuantity; j++) {
          const roomDataObject = {
            name: this.roomData[i].name,
            code: this.roomData[i].code,
          };
          console.log('roomData:', roomDataObject);
          this.room.saveRoomData(roomDataObject).subscribe((response: any) => {
            console.log('Data saved successfully:', response);

            this.selectedRooms.push(roomDataObject);
          });
        }
      }
    }
  }

  // Function to save equipment data
  saveEquipmentData(): void {
    console.log('Save data method called');

    for (let i = 0; i < this.selectedEquipment.length; i++) {
      const roomDataObject1 = {
        name: this.selectedEquipment[i].name,
      };
      console.log('equipmentdata:', roomDataObject1);
      this.room.saveEquipmentData(roomDataObject1).subscribe((response: any) => {
        console.log('Data saved successfully:', response);
        this.selectedEquipments.push(roomDataObject1); // Add the selected equipment to the array immediately
      });
    }
    this.selectedEquipment = []; // Clear the selected equipment array
  }

  // Function to add selected equipment to the array | SAVED ONLY ONE TIME
  selectEquipment(item: any): void {
    const isItemSelected = this.selectedEquipment.includes(item);
    if (!isItemSelected) {
      this.selectedEquipment.push(item);
    }
  }

  // Function to load room list
  loadSelectedRooms(): void {
    this.room.getSelectedRooms(this.projectId).subscribe((data: any) => {
      this.selectedRooms = data.rooms;
    });
  }

  // Function to load equipment list
  loadSelectedEquipments(): void {
    this.room.getSelectedEquipments().subscribe((data: any) => {
      this.selectedEquipments = data.equipments;
    });
  }

  // Function to load room data
  loadRoomData(): void {
    this.room.Load(0, 10).subscribe((data: any) => {
      this.roomData = data.results;
      console.log(data.results);
    });
  }

  // Event handler for button click in a row
  buttonInRowClick(event: any): void {
    event.stopPropagation();
    console.log('Button in the row clicked.');
  }

  wholeRowClick(): void {
    console.log('Whole row clicked.');
  }

  nextButtonClickEvent(): void {
    console.log('Next clicked');
  }

  previousButtonClickEvent(): void { }

}
