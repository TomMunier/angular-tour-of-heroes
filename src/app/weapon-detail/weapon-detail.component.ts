import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {Weapon} from '../model/weapon';
import {WeaponService} from '../service/weapon.service';

@Component({
  selector: 'app-weapon-detail',
  templateUrl: './weapon-detail.component.html',
  styleUrls: ['./weapon-detail.component.css']
})
export class WeaponDetailComponent implements OnInit {

  @Input() weapon: Weapon;
  totalPoints = Weapon.TOTAL_POINTS;
  minPoints = Weapon.MIN_POINTS;
  maxPoints = Weapon.MAX_POINTS;
  remainingPoints = 0;

  constructor(
    private route: ActivatedRoute,
    private weaponService: WeaponService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getWeapon();
  }

  getWeapon(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.weaponService.getWeapon(id)
      .subscribe(weapon => {
        this.weapon = weapon;
        this.updateForm();
      });
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.weaponService.updateWeapon(this.weapon)
      .subscribe(() => this.goBack());
  }

  /**
   * Mise àjour des points restants
   */
  updateForm() {
    this.remainingPoints = this.totalPoints - this.weapon.attack - this.weapon.dodge - this.weapon.damage - this.weapon.hp;
  }

}
