import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationFormPage } from './invitation-form.page';

describe('InvitationFormPage', () => {
  let component: InvitationFormPage;
  let fixture: ComponentFixture<InvitationFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitationFormPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
