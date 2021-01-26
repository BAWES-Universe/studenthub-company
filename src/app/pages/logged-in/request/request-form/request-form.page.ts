import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, AlertController, PopoverController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
// services

import { CompanyRequestService } from 'src/app/providers/logged-in/company-request.service';
import { AuthService } from 'src/app/providers/auth.service';
import { EventService } from 'src/app/providers/event.service';
// models
import { Request } from 'src/app/models/request';
@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.page.html',
  styleUrls: ['./request-form.page.scss'],
})
export class RequestFormPage implements OnInit {

  public company;

  public saving = false;

  public model: Request = new Request();
  public operation: string;

  public form: FormGroup;

  public requestID = null;

  public borderLimit = false;

  constructor(
    public requestService: CompanyRequestService,
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private popoverCtrl: PopoverController,
    private location: Location,
    private eventService: EventService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() { }

  ionViewWillEnter() {

    this.requestID = this.route.snapshot.paramMap.get('id');

    if (window.history.state.model) {
      this.model = window.history.state.model;
      this.loadForm();
    } else if (this.requestID) {
      this.detail(this.requestID);
    } else {
      this.loadForm();
    }
  }

  loadForm() {
    this.company = this.model.company;
    this.form = this.fb.group({
      position_type: [this.model.request_position_type + '', Validators.required],
      position_title: [this.model.request_position_title, Validators.required],
      number_of_employees: [this.model.request_number_of_employees, Validators.required],
      additional_info: [this.model.request_additional_info]
    });

    this.operation = (this.requestID) ? 'Update' : 'Create';
  }

  /**
   * Update Model Data based on Form Input
   */
  updateModelDataFromForm() {
    this.model.request_position_type = this.form.value.position_type;
    this.model.request_position_title = this.form.value.position_title;
    this.model.request_number_of_employees = this.form.value.number_of_employees;
    this.model.request_additional_info = this.form.value.additional_info;
  }

  /**
   * Close the page
   */
  close() {
    const data = { refresh: false };
    this.modalCtrl.dismiss(data);
  }

  /**
   * Save the model
   */
  async save() {

    this.saving = true;

    this.updateModelDataFromForm();

    let action;

    if (!this.model.request_uuid) {
      // Create
      action = this.requestService.create(this.model);
    } else {
      // Update
      action = this.requestService.update(this.model);
    }

    action.subscribe(async jsonResponse => {

      this.saving = false;

      // On Success
      if (jsonResponse.operation == 'success') {
        this.eventService.companyRequestUpdate$.next();
        // Close the page
        this.location.back();
      }

      // On Failure
      if (jsonResponse.operation == 'error') {
        const prompt = await this.alertCtrl.create({
          message: this.authService.errorMessage(jsonResponse),
          buttons: ['Ok']
        });
        prompt.present();
      }
    }, () => {

      this.saving = false;

    });
  }

  /**
   * request detail
   * @param id
   */
  async detail(id) {
    this.requestService.view(id).subscribe(data => {
      this.model = data;
      this.loadForm();
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  resetForm() {
    this.company = null;
    this.form.controls.position_type.setValue(null);
    this.form.controls.position_title.setValue(null);
    this.form.controls.number_of_employees.setValue(null);
    this.form.controls.additional_info.setValue(null);
  }
}
