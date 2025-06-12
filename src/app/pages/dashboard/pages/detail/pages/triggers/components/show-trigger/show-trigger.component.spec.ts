import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowTriggerComponent } from './show-trigger.component';

describe('ShowTriggerComponent', () => {
  let component: ShowTriggerComponent;
  let fixture: ComponentFixture<ShowTriggerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowTriggerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowTriggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
