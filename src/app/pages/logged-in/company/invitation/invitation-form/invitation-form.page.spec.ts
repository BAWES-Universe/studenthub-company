import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InvitationFormPage } from './invitation-form.page';

describe('InvitationFormPage', () => {
  let component: InvitationFormPage;
  let fixture: ComponentFixture<InvitationFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitationFormPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InvitationFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
