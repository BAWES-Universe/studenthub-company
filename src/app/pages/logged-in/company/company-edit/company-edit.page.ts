import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
//models
import { Company } from 'src/app/models/company';
//services
import { AuthService } from 'src/app/providers/auth.service';
import { EventService } from 'src/app/providers/event.service';
import { CompanyService } from 'src/app/providers/logged-in/company.service';
import { TranslateLabelService } from "../../../../providers/translate-label.service";


@Component({
  selector: 'app-company-edit',
  templateUrl: './company-edit.page.html',
  styleUrls: ['./company-edit.page.scss'],
})
export class CompanyEditPage implements OnInit {

  @ViewChild('ckeditor', { static: false }) ckeditor: ClassicEditor;
  @ViewChild('ckeditor_ar', { static: false }) ckeditor_ar: ClassicEditor;

  public loading: boolean;

  public saving = false;

  public form: FormGroup;

  public model: Company;

  public detailSubscription: Subscription;

  public saveSubscription: Subscription;

  public borderLimit: boolean = false;

  public editorConfig = {
    placeholder: 'Click here add description...',
    startupFocus: true,
    width: '100%',
    toolbar: ['Heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'indent', 'outdent'],
  };
  
  public Editor = ClassicEditor;

  constructor(
    public navCtrl: NavController,
    private _fb: FormBuilder,
    public alertCtrl: AlertController,
    private _toastCtrl: ToastController,
    public eventService: EventService,
    public companyService: CompanyService,
    public authService: AuthService,
    public translateService: TranslateLabelService
  ) { }

  ngOnInit() {
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 25);
  }

  ionViewWillEnter() {
    if (this.model) {
      this._initForm();
    } else {
      this.loadData();
    }
  }

  /**
   * load employer detail to initialize form
   */
  async loadData() {
    this.loading = true;

    this.detailSubscription = this.companyService.view(this.authService.company_id).subscribe(response => {
      this.loading = false;

      this.model = response;

      this._initForm();
    },
      error => {
        this.loading = false;
      }, () => {
        this.detailSubscription.unsubscribe();
      });
  }

  /**
   * initialize form
   */
  async _initForm() {

    this.form = this._fb.group({
      name: [this.model.company_name, [Validators.required]],
      common_name_en: [this.model.company_common_name_en, [Validators.required]],
      common_name_ar: [this.model.company_common_name_ar, [Validators.required]],
      description_en: [this.model.company_description_en],
      description_ar: [this.model.company_description_en],
      website: [this.model.company_website],
      email: [this.model.company_email],
    });
  }

  /**
   * Attempts to save company details
   */
  async save() {

    if (!this.form || !this.form.valid) {
      return false;
    }

    this.updateModel();

    this.saving = true;

    this.companyService.update(this.model).subscribe(jsonResponse => {

      this.saving = false;


      if (jsonResponse.operation == 'success') {

        this.authService.company = this.model;

        this.eventService.companyUpdated$.next({
          'company': this.model,
        });

        // success toast
        this._toastCtrl.create({
          message: jsonResponse.message,
          duration: 3000
        }).then(toast => toast.present());

        this.navCtrl.navigateRoot('/');
      }

      // On Failure
      if (jsonResponse.operation == 'error') {
        this.alertCtrl.create({
          message: this.authService.errorMessage(jsonResponse.message),
          buttons: [this.translateService.transform('Okay')]
        }).then(alert => {
          alert.present();
        });
      }
    },
    error => {
      this.saving = false;
    }, () => {
     // this.saveSubscription.unsubscribe();
    });
  }

  /**
   * update model values
   */
  async updateModel() {
    this.model.company_name = this.form.value.name;
    this.model.company_common_name_en = this.form.value.common_name_en;
    this.model.company_common_name_ar = this.form.value.common_name_ar;
    this.model.company_description_en = this.form.value.description_en;
    this.model.company_description_ar = this.form.value.description_ar;
    this.model.company_website = this.form.value.website;
    this.model.company_email = this.form.value.email;
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

    this.form.controls.description_en.setValue(data);
    this.form.markAsDirty();
    this.form.updateValueAndValidity();
  }

  /**
   * on note editor change
   * @param event
   */
   onArabicEditorChange(event) {

    if (!event.editor) {
      return event;
    }

    const data = event.editor.getData();

    this.form.controls.description_ar.setValue(data);
    this.form.markAsDirty();
    this.form.updateValueAndValidity();
  }

  onEditorReady() {
    const interval = setTimeout(() => {
      if (this.ckeditor.editorInstance && this.form.value.description_en) {
        this.ckeditor.editorInstance.setData(this.form.value.description_en);
        // this.ckeditor.editorInstance.editing.view.focus();
        // clearInterval(interval);
      }
    }, 200);
  }

  onArabicEditorReady() {
    const interval = setTimeout(() => {
      if (this.ckeditor_ar.editorInstance && this.form.value.description_ar) {
        this.ckeditor_ar.editorInstance.setData(this.form.value.description_ar);
        // this.ckeditor.editorInstance.editing.view.focus();
        // clearInterval(interval);
      }
    }, 200);
  }
}
