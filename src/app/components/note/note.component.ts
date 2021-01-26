import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController, ModalController, Platform } from '@ionic/angular';
//models
import { Note } from 'src/app/models/note';
//services
import { NoteService } from 'src/app/providers/logged-in/note.service';


@Component({
  selector: 'note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
})
export class NoteComponent implements OnInit {

  @Input() note: Note;
  @Input() from;

  @Output() onEdit: EventEmitter<any> = new EventEmitter();
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  @Output() onDelete: EventEmitter<any> = new EventEmitter();

  public deletingNote: boolean = false;

  constructor(
    public platform: Platform,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public noteService: NoteService
  ) { }

  ngOnInit() {

  }

  /**
   * Make date readable by Safari
   * @param date
   */
  toDate(date) {
    if (date) {
      return new Date(date.replace(/-/g, '/'));
    }
  }

  doNothing(event) {
    event.preventDefault();
    event.stopPropagation();
  }
}
