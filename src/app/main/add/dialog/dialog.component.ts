import {Component, Input, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  constructor(
      private modal: NgbModal,
  ) { }

  @Input() data: any;
  ngOnInit(): void {
  }

  toggleSidebar() {
    this.modal.dismissAll();
  }
}
