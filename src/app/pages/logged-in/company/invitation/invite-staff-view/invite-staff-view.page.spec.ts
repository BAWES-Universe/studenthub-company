import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteStaffViewPage } from './invite-staff-view.page';

describe('InviteStaffViewPage', () => {
  let component: InviteStaffViewPage;
  let fixture: ComponentFixture<InviteStaffViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteStaffViewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteStaffViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
