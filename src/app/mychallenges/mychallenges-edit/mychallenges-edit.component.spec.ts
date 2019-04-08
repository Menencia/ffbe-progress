import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MychallengesEditComponent } from './mychallenges-edit.component';

describe('FormMissionsComponent', () => {
  let component: MychallengesEditComponent;
  let fixture: ComponentFixture<MychallengesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MychallengesEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MychallengesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
