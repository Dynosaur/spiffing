import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StandaloneCardComponent } from './standalone-card.component';

describe('StandaloneCardComponent', () => {
  let component: StandaloneCardComponent;
  let fixture: ComponentFixture<StandaloneCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StandaloneCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandaloneCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
