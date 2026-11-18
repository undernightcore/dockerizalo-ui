import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMemberComponent } from './create-member.component';

describe('CreateMemberComponent', () => {
  let component: CreateMemberComponent;
  let fixture: ComponentFixture<CreateMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMemberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
