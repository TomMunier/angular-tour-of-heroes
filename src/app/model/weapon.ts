import {Hero} from './hero';

export class Weapon {
  // constantes
  public static readonly TOTAL_POINTS = 0;
  public static readonly MIN_POINTS = -5;
  public static readonly MAX_POINTS = 5;
  // attributs
  private _id: number;
  private _name: string;
  private _attack: number;
  private _dodge: number;
  private _damage: number;
  private _hp: number;


  /**
   * Constructeur d'arme
   * @param {number} id
   * @param {string} name
   * @param {number} attack
   * @param {number} dodge
   * @param {number} damage
   * @param {number} hp
   */
  constructor(id: number, name: string, attack: number = 0, dodge: number = -5, damage: number = 5, hp: number = 0) {
    this.id = id;
    this.name = name;
    this.attack = attack;
    this.dodge = dodge;
    this.damage = damage;
    this.hp = hp;
  }

  // New static method.
  static fromJSONArray(array: Array<Object>): Weapon[] {
    return array.map(obj => new Weapon(obj['id'], obj['name'], obj['attack'], obj['dodge'], obj['damage'], obj['hp']));
  }

  static fromJSON(object: Object): Weapon {
    return new Weapon(object['id'], object['name'], object['attack'], object['dodge'], object['damage'], object['hp']);
  }

  getJSONObject(): Object {
    const object: Object = new Object();
    object['id'] = this.id;
    object['name'] = this.name;
    object['attack'] = this.attack;
    object['dodge'] = this.dodge;
    object['damage'] = this.damage;
    object['hp'] = this.hp;
    return object;
  }

  // -------------------------------------------------
  // Getters And Setters
  // -------------------------------------------------
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
}
