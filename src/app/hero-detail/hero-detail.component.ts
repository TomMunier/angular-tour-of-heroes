import {Component, OnInit, Input} from '@angular/core';
import { Hero } from '../model/hero';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { HeroService } from '../service/hero.service';
import {Weapon} from '../model/weapon';
import {WeaponService} from '../service/weapon.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {

  @Input() hero: Hero;
  minPoints = Hero.MIN_POINTS;
  maxPoints = Hero.MAX_POINTS;
  remainingPoints = 0;
  weapons: Weapon[];
  attackBar;
  dodgeBar;
  damageBar;
  hpBar;

  private heroSubscription;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private weaponService: WeaponService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getWeapons();
  }

  ngOnDestroy() {
    this.heroSubscription.unsubscribe();
  }

  getHero(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.heroSubscription = this.heroService.getHero(id)
      .subscribe(hero => {
        this.hero = hero;
        this.updateForm();
      });
  }

  getWeapons(): void {
    this.weaponService.getWeapons()
      .subscribe(weapons => {
        this.weapons = weapons;
        this.getHero();
      });
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.heroService.updateHero(this.hero)
      .subscribe(() => this.goBack());
  }

  /**
   * Mise à jour des points restants et des barres graphiques de compétences
   */
  updateForm() {
    this.remainingPoints = this.maxPoints - this.hero.attack - this.hero.dodge - this.hero.damage - this.hero.hp;
    this.attackBar = this.hero.attack * 100 / 40;
    this.dodgeBar = this.hero.dodge * 100 / 40;
    this.damageBar = this.hero.damage * 100 / 40;
    this.hpBar = this.hero.hp * 100 / 40;
  }

  compareFn(w1: Weapon, w2: Weapon): boolean {
    return w1 && w2 ? w1.id === w2.id : w1 === w2;
  }

}
