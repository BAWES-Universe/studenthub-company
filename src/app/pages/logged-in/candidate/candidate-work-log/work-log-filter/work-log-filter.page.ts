import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'app-work-log-filter',
  templateUrl: './work-log-filter.page.html',
  styleUrls: ['./work-log-filter.page.scss'],
})
export class WorkLogFilterPage implements OnInit {

  public filters: {
    name: string,
    session_status: number,
    end_date: string,
    start_date: string
  };

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
  }

  close() {
    this.modalCtrl.getTop().then(o => {
      if(o) {
        o.dismiss({ refresh: false });
      }
    });
  }

  fetchResult() {
    this.modalCtrl.getTop().then(o => {
      if(o) {
        o.dismiss({ refresh: true, filter: this.filters });
      }
    });
  }

  filterByStatus($event, status) {

    if(this.filters.session_status == status) {
      this.filters.session_status = null;
    } else {
      this.filters.session_status = status;
    }

    //this.loadData(1); // reload all result
  }

  filterDate($event, type) {
    if (type == 'start_date') {
      this.filters.start_date = format(parseISO($event.original), 'yyyy-MM-dd');
    } else {
      this.filters.end_date = format(parseISO($event.original), 'yyyy-MM-dd');
    }
  }

  resetStatus() {
    this.filters.session_status = null;
  }

  resetFilter() {
    this.filters = {
      session_status: null,
      end_date: null, 
      start_date: null,
      name: this.filters.name
    };
  }
}
