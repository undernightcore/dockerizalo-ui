import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildsDetailComponent } from './builds-detail.component';

describe('BuildsDetailComponent', () => {
  let component: BuildsDetailComponent;
  let fixture: ComponentFixture<BuildsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildsDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
