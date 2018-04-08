import {Weapon} from './weapon';
import {WeaponService} from '../service/weapon.service';
import {Injectable} from '@angular/core';
import {AppModule} from '../app.module';

@Injectable()
export class Hero {
  // constantes
  public static readonly MIN_POINTS = 1;
  public static readonly MAX_POINTS = 40;
  // attributs
  private _id: number;
  private _name: string;
  private _attack: number;
  private _dodge: number;
  private _damage: number;
  private _hp: number;
  private _weapons: Weapon[];
  // services
  private weaponService; // nécessaire pour récupérer les armes à partir des ids
  // bonus ou malus provenant des armes ( = somme des points d'armes)
  private _bonusAttack: number;
  private _bonusDodge: number;
  private _bonusDamage: number;
  private _bonusHp: number;


  /**
   * Constructeur de héro
   * @param {number} id
   * @param {string} name
   * @param {number} attack
   * @param {number} dodge
   * @param {number} damage
   * @param {number} hp
   * @param {number[]} weapons
   */
  constructor(id: number, name: string, attack: number = 10, dodge: number = 10, damage: number = 10, hp: number = 10, weapons: number[] = []) {
    this.weaponService = AppModule.injector.get(WeaponService);
    this.id = id;
    this.name = name;
    this.attack = attack;
    this.dodge = dodge;
    this.damage = damage;
    this.hp = hp;
    this.weapons = [];
    this.bonusAttack = this.bonusDodge = this.bonusDamage = this.bonusHp = 0;
    // Récupération des armes en asynchrone
    this.getWeaponsFromIds(weapons);
  }

  // New static method.
  static fromJSONArray(array: Array<Object>): Hero[] {
    return array.map(obj => new Hero(obj['id'], obj['name'], obj['attack'], obj['dodge'], obj['damage'], obj['hp'], obj['weapons']));
  }

  static fromJSON(object: Object): Hero {
    return new Hero(object['id'], object['name'], object['attack'], object['dodge'], object['damage'], object['hp'], object['weapons']);
  }

  getJSONObject(): Object {
    const object: Object = new Object();
    object['id'] = this.id;
    object['name'] = this.name;
    object['attack'] = this.attack;
    object['dodge'] = this.dodge;
    object['damage'] = this.damage;
    object['hp'] = this.hp;
    object['weapons'] = this.weapons.map(obj => obj.id);
    return object;
  }

  /**
   * Réupère les armes du héros à partir des ids stockés en base de données, puis les assigne au héro
   * @param {number[]} ids
   */
  getWeaponsFromIds(ids: number[]) {
    this.weaponService.getWeaponsFromIds(ids).subscribe(value => {
      this.weapons = value;
      this.updateBonusWeapons();
    });
  }

  /**
   * Calcul et mise à jour des bonus/malus provenant des armes que possède le héro
   */
  updateBonusWeapons() {
    this.bonusAttack = this.bonusDodge = this.bonusDamage = this.bonusHp = 0;
    for (let i = 0; i < this.weapons.length; i++) {
      this.bonusAttack += this.weapons[i].attack;
      this.bonusDodge += this.weapons[i].dodge;
      this.bonusDamage += this.weapons[i].damage;
      this.bonusHp += this.weapons[i].hp;
    }
  }

  /**
   * Vérifie que le formulaire est valide
   * @returns {boolean}
   */
  isValid(): boolean {
    return this.attack != null
      && this.dodge != null
      && this.damage != null
      && this.hp != null
      && this.attack >= Hero.MIN_POINTS
      && this.dodge >= Hero.MIN_POINTS
      && this.damage >= Hero.MIN_POINTS
      && this.hp >= Hero.MIN_POINTS;
  }

  /**
   * Suppression de l'association entre une arme et le héro si l'id correspond
   * @param {number} id de l'arme
   * @returns {boolean} supprimé ou non
   */
  removeWeapon(id: number) {
    const found = this.weapons.find(function(weapon) {
      return weapon.id === id;
    });
    if (found !== undefined) {
      const index = this.weapons.indexOf(found, 0);
      if (index > -1) {
        this.weapons.splice(index, 1);
      }
      // l'arme a été supprimée
      return true;
    } else {
      // l'arme n'était pas présente
      return false;
    }
  }

  // -------------------------------------------------
  // Getters And Setters
  // -------------------------------------------------

  get weapons(): Weapon[] {
    return this._weapons;
  }

  set weapons(value: Weapon[]) {
    this._weapons = value;
    this.updateBonusWeapons();
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get attack(): number {
    return this._attack;
  }

  set attack(value: number) {
    this._attack = value;
  }

  get dodge(): number {
    return this._dodge;
  }

  set dodge(value: number) {
    this._dodge = value;
  }

  get damage(): number {
    return this._damage;
  }

  set damage(value: number) {
    this._damage = value;
  }

  get hp(): number {
    return this._hp;
  }

  set hp(value: number) {
    this._hp = value;
  }
  get bonusAttack(): number {
    return this._bonusAttack;
  }

  set bonusAttack(value: number) {
    this._bonusAttack = value;
  }

  get bonusDodge(): number {
    return this._bonusDodge;
  }

  set bonusDodge(value: number) {
    this._bonusDodge = value;
  }

  get bonusDamage(): number {
    return this._bonusDamage;
  }

  set bonusDamage(value: number) {
    this._bonusDamage = value;
  }

  get bonusHp(): number {
    return this._bonusHp;
  }

  set bonusHp(value: number) {
    this._bonusHp = value;
  }
}
