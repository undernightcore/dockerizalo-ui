import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTokenComponent } from './delete-token.component';

describe('DeleteTokenComponent', () => {
  let component: DeleteTokenComponent;
  let fixture: ComponentFixture<DeleteTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteTokenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
