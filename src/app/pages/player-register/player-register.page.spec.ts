import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerRegisterPage } from './player-register.page';

describe('PlayerRegisterPage', () => {
  let component: PlayerRegisterPage;
  let fixture: ComponentFixture<PlayerRegisterPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerRegisterPage]
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerRegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
