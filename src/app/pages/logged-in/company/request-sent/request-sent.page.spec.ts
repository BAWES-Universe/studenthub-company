import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestSentPage } from './request-sent.page';

describe('RequestSentPage', () => {
  let component: RequestSentPage;
  let fixture: ComponentFixture<RequestSentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestSentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestSentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
