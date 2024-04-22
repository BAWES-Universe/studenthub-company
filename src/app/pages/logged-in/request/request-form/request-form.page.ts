import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// services
import { CompanyRequestService } from 'src/app/providers/logged-in/company-request.service';
import { EventService } from 'src/app/providers/event.service';
import { TranslateLabelService } from "../../../../providers/translate-label.service";
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { CountryService } from 'src/app/providers/country.service';
// models
import { Request } from 'src/app/models/request';
import { Country } from 'src/app/models/country';


@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.page.html',
  styleUrls: ['./request-form.page.scss'],
})
export class RequestFormPage implements OnInit {

  @ViewChild('ckeditor', { static: false }) ckeditor: ClassicEditor;

  public company;

  public saving = false;

  public model: Request = new Request();
  public operation: string;

  public form: FormGroup;

  public requestID = null;

  public borderLimit = false;

  public editorConfig = {
    placeholder: 'Click here add description...',
    startupFocus: true,
    width: '100%',
    toolbar: ['Heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'indent', 'outdent'],
  };
  
  public Editor = ClassicEditor;

  public countrylistData: Country[] = [];

  constructor(
    public requestService: CompanyRequestService,
    private fb: FormBuilder,
    private alertCtrl: AlertController,
    private location: Location,
    private eventService: EventService,
    private route: ActivatedRoute,
    public countryService: CountryService,
    private translateService: TranslateLabelService,
    public analyticService: AnalyticsService
  ) {
  }

  ngOnInit() { 
    this.analyticService.page('Request Form Page');
  }

  ionViewWillLeave() {
    this.analyticService.track('page_exit', {
      'page': 'Request Form Page'
    });  
  }
  
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
  
    this.loadCountryList();
  }

  /**
   * Load list of countries
   */
  loadCountryList() {
    this.countryService.list(-1).subscribe(response => {
      this.countrylistData = response.body;
    });
  }

  loadForm() {
    this.company = this.model.company;

    let skillCtrls = [];

    if(this.model.requestSkills) {
      for (let requestSkill of this.model.requestSkills) {
        skillCtrls.push(this.fb.group({
          skill: [requestSkill.skill]//, [Validators.required]
        }));
      }
    }

    skillCtrls.push(this.fb.group({
      skill: ['', []]
    }));

    this.form = this.fb.group({
      position_type: [this.model.request_position_type + '', Validators.required],
      position_title: [this.model.request_position_title, Validators.required],
      number_of_employees: [this.model.request_number_of_employees, Validators.required],
      location: [this.model.request_location],
      additional_info: [this.model.request_additional_info],
      job_description: [this.model.request_job_description, Validators.required],
      compensation: [this.model.request_compensation, Validators.required],
      requestSkills:  new FormArray(skillCtrls),
      nationality_id: [this.model.nationality_id],
      gender: [this.model.gender + '']
    });

    this.operation = (this.requestID) ? this.translateService.transform('Update') : this.translateService.transform('Create');
  }

  /**
   * Update Model Data based on Form Input
   */
  updateModelDataFromForm() {
    this.model.request_position_type = this.form.value.position_type;
    this.model.request_position_title = this.form.value.position_title;
    this.model.request_number_of_employees = this.form.value.number_of_employees;
    this.model.request_additional_info = this.form.value.additional_info;
    this.model.request_job_description = this.form.value.job_description;
    this.model.request_compensation = this.form.value.compensation;
    this.model.request_location = this.form.value.location;
    this.model.requestSkills = this.form.value.requestSkills;
    this.model.gender = this.form.value.gender; 
    this.model.nationality_id = this.form.value.nationality_id;
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
          message: this.translateService.errorMessage(jsonResponse.message),
          buttons: [this.translateService.transform('Okay')]
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

  /**
   * reser form controls
   */
  resetForm() {
    this.company = null;
    this.form.controls.position_type.setValue(null);
    this.form.controls.position_title.setValue(null);
    this.form.controls.number_of_employees.setValue(null);
    this.form.controls.additional_info.setValue(null);
    this.form.controls.job_description.setValue(null);
    this.form.controls.compensation.setValue(null);
    this.form.controls.location.setValue(null);
    this.form.controls.nationality_id.setValue(null);
    this.form.controls.gender.setValue(null);
    this.form.controls['requestSkills'].setValue([
      this.fb.group({
        skill: ['', []]
      })
    ]);
  }

  // convenience getters for easy access to form fields
  get f() { return this.form.controls; }
  get requestSkills() { return <FormArray<FormGroup>>this.f['requestSkills']; } //as FormArray

  removeSkill(index) {
    this.requestSkills.removeAt(index);
    this.requestSkills.markAsDirty();
  }

  addSkill() {
    this.requestSkills.push(this.fb.group({
      skill: ['', []]
    }));
  }

  /**
   * add new input
   * @param event
   * @param index
   */
  onSkillChange(event, index) {

    // remove field on clearing it out + have next empty field

    if (this.requestSkills.length - index > 1 && event.target.value.length == 0) {
      return this.removeSkill(index);
    }

    // check if new field is not added && something is typed
    if (((index - this.requestSkills.length) === -1) && event.target.value) {
      // adding new field
      this.addSkill();
    }
  }

  onEditorReady() {
    const interval = setTimeout(() => {
      if (this.ckeditor.editorInstance && this.form.value.job_description) {
        this.ckeditor.editorInstance.setData(this.form.value.job_description);
        // this.ckeditor.editorInstance.editing.view.focus();
        // clearInterval(interval);
      }
    }, 200);
  }
  
  /**
   * on note editor change
   * @param event
   */
   onChange(event) {

    if (!event.editor) {
      return event;
    }

    const data = event.editor.getData();

    this.form.controls.job_description.setValue(data);
    this.form.markAsDirty();
    this.form.updateValueAndValidity();
  }
}
