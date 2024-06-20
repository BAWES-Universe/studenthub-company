import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePopupComponent } from './update-alert.component';
import { UpdateAlertModule } from './update-alert.module';
import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from 'src/app/app.module';

describe('DatePopupComponent', () => {
  let component: DatePopupComponent;
  let fixture: ComponentFixture<DatePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
      imports: [
        AppModule,
        UpdateAlertModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents().then(_ => {
      fixture = TestBed.createComponent(DatePopupComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
