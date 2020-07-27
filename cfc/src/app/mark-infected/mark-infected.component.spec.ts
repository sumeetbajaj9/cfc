import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkInfectedComponent } from './mark-infected.component';

describe('MarkInfectedComponent', () => {
  let component: MarkInfectedComponent;
  let fixture: ComponentFixture<MarkInfectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkInfectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkInfectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
