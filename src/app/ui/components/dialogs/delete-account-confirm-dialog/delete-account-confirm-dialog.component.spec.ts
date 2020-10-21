import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAccountConfirmDialogComponent } from './delete-account-confirm-dialog.component';

describe('DeleteAccountConfirmDialogComponent', () => {
  let component: DeleteAccountConfirmDialogComponent;
  let fixture: ComponentFixture<DeleteAccountConfirmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteAccountConfirmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteAccountConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
