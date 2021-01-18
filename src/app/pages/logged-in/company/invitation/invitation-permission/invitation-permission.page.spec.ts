import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationPermissionPage } from './invitation-permission.page';

describe('InvitationPermissionPage', () => {
  let component: InvitationPermissionPage;
  let fixture: ComponentFixture<InvitationPermissionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitationPermissionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationPermissionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
