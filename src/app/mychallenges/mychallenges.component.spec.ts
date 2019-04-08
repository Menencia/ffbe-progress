import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MychallengesComponent } from './mychallenges.component';

describe('MychallengesComponent', () => {
  let component: MychallengesComponent;
  let fixture: ComponentFixture<MychallengesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MychallengesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MychallengesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
