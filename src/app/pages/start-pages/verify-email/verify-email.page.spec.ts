import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyEmailPage } from './verify-email.page';
import { VerifyEmailPageModule } from './verify-email.module';
import { AppModule } from '../../../app.module';

import { CvBuilderService } from '../../../services/logged-in/cvbuilder.service';
import { CvBuilderSpyService } from '../../../spy-services/cvbuilder-spy.service';
import { TestModule } from 'src/app/test.module';


describe('VerifyEmailPage', () => {
  let component: VerifyEmailPage;
  let fixture: ComponentFixture<VerifyEmailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        TestModule,
        VerifyEmailPageModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })

    // Override component's own provider
    .overrideComponent(VerifyEmailPage, {
      set: {
        providers: [
          { provide: CvBuilderService, useClass: CvBuilderSpyService }
        ]
      }
    })
      .compileComponents().then(_ => {

        fixture = TestBed.createComponent(VerifyEmailPage);
        component = fixture.componentInstance;
        
        fixture.detectChanges();
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
