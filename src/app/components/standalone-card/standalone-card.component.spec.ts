import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandaloneCardComponent } from './standalone-card.component';

describe('StandaloneCardComponent', () => {
  let component: StandaloneCardComponent;
  let fixture: ComponentFixture<StandaloneCardComponent>;

  beforeEach(async(() => {
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
