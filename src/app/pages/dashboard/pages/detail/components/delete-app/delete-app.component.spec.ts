import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAppComponent } from './delete-app.component';

describe('DeleteAppComponent', () => {
  let component: DeleteAppComponent;
  let fixture: ComponentFixture<DeleteAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteAppComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
