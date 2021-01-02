import { ViewPostDialogComponent } from './view-post-dialog.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

describe('ViewPostDialogComponent', () => {
  let component: ViewPostDialogComponent;
  let fixture: ComponentFixture<ViewPostDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPostDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPostDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
