import { Component, OnInit } from '@angular/core';

import {WeaponService} from '../service/weapon.service';
import {Weapon} from '../model/weapon';
import {Hero} from '../model/hero';
import {Sort} from '@angular/material';

@Component({
  selector: 'app-weapons',
  templateUrl: './weapons.component.html',
  styleUrls: ['./weapons.component.css']
})
export class WeaponsComponent implements OnInit {

  weapons: Weapon[]; // toutes les armes
  minPoints = Weapon.MIN_POINTS;
  maxPoints = Weapon.MAX_POINTS;

  // Attributs de filtrage
  private _filteredWeapons: Weapon[]; // les armes filtrées par le formulaire
  private _filterName = '';
  private _filterMinAttack;
  private _filterMaxAttack;
  private _filterMinDodge;
  private _filterMaxDodge;
  private _filterMinDamage;
  private _filterMaxDamage;
  private _filterMinHp;
  private _filterMaxHp;

  /**
   * Constructeur
   * @param {WeaponService} weaponService
   */
  constructor (private weaponService: WeaponService) {
    this._filterMinAttack = Weapon.MIN_POINTS;
    this._filterMaxAttack = Weapon.MAX_POINTS;
    this._filterMinDodge = Weapon.MIN_POINTS;
    this._filterMaxDodge = Weapon.MAX_POINTS;
    this._filterMinDamage = Weapon.MIN_POINTS;
    this._filterMaxDamage = Weapon.MAX_POINTS;
    this._filterMinHp = Weapon.MIN_POINTS;
    this._filterMaxHp = Weapon.MAX_POINTS;
  }

  ngOnInit() {
    this.getWeapons();
  }

  getWeapons(): void {
    this.weaponService.getWeapons()
      .subscribe(weapons => {
        this.weapons = weapons;
        this._filteredWeapons = this.weapons;
      });
  }

  /**
   * Création d'une arme à partir d'un simple nom
   * @param {string} name
   */
  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.weaponService.addWeapon(name)
      .subscribe(weapon => {
        this.filterWeapons();
      }).unsubscribe();
  }

  /**
   * Suppression d'une arme
   * @param {Weapon} weapon
   */
  delete(weapon: Weapon): void {
    this.weapons = this.weapons.filter(h => h !== weapon);
    this.weaponService.deleteWeapon(weapon).subscribe(() => {
      this.filterWeapons();
    });
  }

  /**
   * Fonction de tri par attribut
   * @param {Sort} sort
   */
  sortData(sort: Sort) {
    this.weapons.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id': return compare(+a.id, +b.id, isAsc);
        case 'name': return compare(a.name, b.name, isAsc);
        case 'attack': return compare(+a.attack, +b.attack, isAsc);
        case 'dodge': return compare(+a.dodge, +b.dodge, isAsc);
        case 'damage': return compare(+a.damage, +b.damage, isAsc);
        case 'hp': return compare(+a.hp, +b.hp, isAsc);
        default: return 0;
      }
    });

    this.filterWeapons();
  }

  /**
   * Application du filtrage à partir des valeurs du formulaire de filtrage
   */
  filterWeapons(): void {
    const self = this;
    this._filteredWeapons = [];
    this.weapons.forEach(function (weapon) {
      if (weapon.name.toLowerCase().includes(self.filterName.toLowerCase())
        && weapon.attack >= self.filterMinAttack
        && weapon.attack <= self.filterMaxAttack
        && weapon.dodge >= self.filterMinDodge
        && weapon.dodge <= self.filterMaxDodge
        && weapon.damage >= self.filterMinDamage
        && weapon.damage <= self.filterMaxDamage
        && weapon.hp >= self.filterMinHp
        && weapon.hp <= self.filterMaxHp) {
        self._filteredWeapons.push(weapon);
      }
    });
  }

  // -------------------------------------------------
  // Getters And Setters
  // -------------------------------------------------
  get filteredWeapons(): Weapon[] {
    return this._filteredWeapons;
  }

  set filteredWeapons(value: Weapon[]) {
    this._filteredWeapons = value;
  }

  get filterName(): string {
    return this._filterName;
  }

  set filterName(value: string) {
    this._filterName = value;
  }

  get filterMinAttack(): number {
    return this._filterMinAttack;
  }

  set filterMinAttack(value: number) {
    this._filterMinAttack = value;
  }

  get filterMaxAttack(): number {
    return this._filterMaxAttack;
  }

  set filterMaxAttack(value: number) {
    this._filterMaxAttack = value;
  }

  get filterMinDodge(): number {
    return this._filterMinDodge;
  }

  set filterMinDodge(value: number) {
    this._filterMinDodge = value;
  }

  get filterMaxDodge(): number {
    return this._filterMaxDodge;
  }

  set filterMaxDodge(value: number) {
    this._filterMaxDodge = value;
  }

  get filterMinDamage(): number {
    return this._filterMinDamage;
  }

  set filterMinDamage(value: number) {
    this._filterMinDamage = value;
  }

  get filterMaxDamage(): number {
    return this._filterMaxDamage;
  }

  set filterMaxDamage(value: number) {
    this._filterMaxDamage = value;
  }

  get filterMinHp(): number {
    return this._filterMinHp;
  }

  set filterMinHp(value: number) {
    this._filterMinHp = value;
  }

  get filterMaxHp(): number {
    return this._filterMaxHp;
  }

  set filterMaxHp(value: number) {
    this._filterMaxHp = value;
  }
}

function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
