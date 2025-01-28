import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDiscardComponent } from './confirm-discard.component';

describe('ConfirmDiscardComponent', () => {
  let component: ConfirmDiscardComponent;
  let fixture: ComponentFixture<ConfirmDiscardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDiscardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDiscardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
