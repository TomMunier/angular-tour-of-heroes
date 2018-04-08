import { Component, OnInit } from '@angular/core';
import { Hero } from '../model/hero';
// import { HEROES } from '../data/mock-heroes';
import { HeroService } from '../service/hero.service';
import {Sort} from '@angular/material';


@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  heroes: Hero[];
  minPoints = Hero.MIN_POINTS;
  maxPoints = Hero.MAX_POINTS;

  // Attributs de filtrage
  private _filteredHeroes: Hero[];
  private _filterName = '';
  private _filterMinAttack = Hero.MIN_POINTS;
  private _filterMaxAttack = Hero.MAX_POINTS;
  private _filterMinDodge = Hero.MIN_POINTS;
  private _filterMaxDodge = Hero.MAX_POINTS;
  private _filterMinDamage = Hero.MIN_POINTS;
  private _filterMaxDamage = Hero.MAX_POINTS;
  private _filterMinHp = Hero.MIN_POINTS;
  private _filterMaxHp = Hero.MAX_POINTS;

  private heroesSubscription;

  // Variables pour Tri des héros par caractéristiques
  idDESC = false;
  nameDESC = false;
  attackDESC = false;
  dodgeDESC = false;
  damageDESC = false;
  hpDESC = false;

  constructor (private heroService: HeroService) {}

  ngOnInit() {
    this.getHeroes();
  }

  /**
   * Récupération de tous les héros de la base de données
   */
  getHeroes(): void {
    this.heroesSubscription = this.heroService.getHeroes()
      .subscribe(heroes => {
        this.heroes = heroes;
        // Une fois récupérés on filtre les héros en fonction des valeurs du formulaire
        this.filterHeroes();
      });
  }

  /**
   * Création d'un nouveau héro a partir d'un simple nom
   * @param {string} name
   */
  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero(name)
      .subscribe(hero => {
        this.filterHeroes();
      }).unsubscribe();
  }

  /**
   * Suppression d'un héro
   * @param {Hero} hero
   */
  delete(hero: Hero): void {
    this.heroesSubscription.unsubscribe();
    this.heroService.deleteHero(hero).subscribe(() => {
      this.getHeroes();
    });
  }

  /**
   * Fonction de tri des heros par attribut
   * @param {Sort} sort
   */
  sortData(sort: Sort) {
    this.heroes.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id': return compare(+a.id, +b.id, isAsc);
        case 'name': return compare(a.name, b.name, isAsc);
        case 'attack': return compare(+a.attack + a.bonusAttack, +b.attack + b.bonusAttack, isAsc);
        case 'dodge': return compare(+a.dodge + a.bonusDodge, +b.dodge + b.bonusDodge, isAsc);
        case 'damage': return compare(+a.damage + a.bonusDamage, +b.damage + b.bonusDamage, isAsc);
        case 'hp': return compare(+a.hp + a.bonusHp, +b.hp + b.bonusHp, isAsc);
        default: return 0;
      }
    });

    this.filterHeroes();
  }

  /**
   * Application du filtrage à partir des valeurs du formulaire de filtrage
   */
  filterHeroes(): void {
    const self = this;
    this._filteredHeroes = [];
    this.heroes.forEach(function (hero) {
      // Si le héro correspond aux conditions de filtrage
      if (hero.name.toLowerCase().includes(self.filterName.toLowerCase())
        && hero.attack + hero.bonusAttack >= self.filterMinAttack
        && hero.attack + hero.bonusAttack <= self.filterMaxAttack
        && hero.dodge + hero.bonusDodge >= self.filterMinDodge
        && hero.dodge + hero.bonusDodge <= self.filterMaxDodge
        && hero.damage + hero.bonusDamage >= self.filterMinDamage
        && hero.damage + hero.bonusDamage <= self.filterMaxDamage
        && hero.hp + hero.bonusHp >= self.filterMinHp
        && hero.hp + hero.bonusHp <= self.filterMaxHp) {
        // On ajoute le héro dans le tableau de héros filtrés
        self._filteredHeroes.push(hero);
      }
    });
  }

  /**
   * Trie les héros par ordre d'identifiant ascendant par défaut et descendant si desc = true
   * @param {boolean} desc
   */
  sortHeroesById(desc: boolean = false): void {
    // this.heroes  = $filter('orderBy')(this.heroes, 'TypeId')
    if (desc) {
      this.heroes.sort((a , b) => b.id - a.id);
      this.idDESC = true;
    } else {
      this.heroes.sort((a , b) => a.id - b.id);
      this.idDESC = false;
    }
    this.filterHeroes();
  }

  /**
   * Trie les héros par ordre de nom ascendant par défaut et descendant si desc = true
   * @param {boolean} desc
   */
  sortHeroesByName(desc: boolean = false): void {
    // this.heroes  = $filter('orderBy')(this.heroes, 'TypeId')
    if (desc) {
      this.heroes.sort((a, b) => b.name.localeCompare(a.name));
      this.nameDESC = true;
    } else {
      this.heroes.sort((a, b) => a.name.localeCompare(b.name));
      this.nameDESC = false;
    }
    this.filterHeroes();
  }

  /**
   * Trie les héros par ordre de points d'attaque ascendant par défaut et descendant si desc = true
   * @param {boolean} desc
   */
  sortHeroesByAttack(desc: boolean = false): void {
    if (desc) {
      this.heroes.sort((a , b) => b.attack - a.attack);
      this.attackDESC = true;
    } else {
      this.heroes.sort((a , b) => a.attack - b.attack);
      this.attackDESC = false;
    }
    this.filterHeroes();
  }

  /**
   * Trie les héros par ordre de points d'esquive ascendant par défaut et descendant si desc = true
   * @param {boolean} desc
   */
  sortHeroesByDodge(desc: boolean = false): void {
    if (desc) {
      this.heroes.sort((a , b) => b.dodge - a.dodge);
      this.dodgeDESC = true;
    } else {
      this.heroes.sort((a , b) => a.dodge - b.dodge);
      this.dodgeDESC = false;
    }
    this.filterHeroes();
  }

  /**
   * Trie les héros par ordre de points de dégats ascendant par défaut et descendant si desc = true
   * @param {boolean} desc
   */
  sortHeroesByDamage(desc: boolean = false): void {
    if (desc) {
      this.heroes.sort((a , b) => b.damage - a.damage);
      this.damageDESC = true;
    } else {
      this.heroes.sort((a , b) => a.damage - b.damage);
      this.damageDESC = false;
    }
    this.filterHeroes();
  }

  /**
   * Trie les héros par ordre de points de vie ascendant par défaut et descendant si desc = true
   * @param {boolean} desc
   */
  sortHeroesByHp(desc: boolean = false): void {
    if (desc) {
      this.heroes.sort((a , b) => b.hp - a.hp);
      this.hpDESC = true;
    } else {
      this.heroes.sort((a , b) => a.hp - b.hp);
      this.hpDESC = false;
    }
    this.filterHeroes();
  }

  // -------------------------------------------------
  // Getters And Setters
  // -------------------------------------------------

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

  get filteredHeroes(): Hero[] {
    return this._filteredHeroes;
  }

  set filteredHeroes(value: Hero[]) {
    this._filteredHeroes = value;
  }

}

function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
