import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InvitationPermissionPage } from './invitation-permission.page';

describe('InvitationPermissionPage', () => {
  let component: InvitationPermissionPage;
  let fixture: ComponentFixture<InvitationPermissionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitationPermissionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InvitationPermissionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
