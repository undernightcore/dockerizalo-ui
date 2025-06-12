import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTriggerComponent } from './delete-trigger.component';

describe('DeleteTriggerComponent', () => {
  let component: DeleteTriggerComponent;
  let fixture: ComponentFixture<DeleteTriggerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteTriggerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteTriggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
