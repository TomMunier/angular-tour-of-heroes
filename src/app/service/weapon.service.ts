import { Injectable } from '@angular/core';
import {catchError, map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MessageService} from './message.service';
import {of} from 'rxjs/observable/of';
import {Weapon} from '../model/weapon';
import {AngularFirestore} from 'angularfire2/firestore';
import {HeroService} from './hero.service';
import {forEach} from '@angular/router/src/utils/collection';
import {Hero} from '../model/hero';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class WeaponService {

  private db: AngularFirestore; // Firebase

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private heroService: HeroService,
    db: AngularFirestore) { this.db = db; }

  /**
   * Retourne toutes les armes présentes en BD
   * @returns {Observable<Weapon[]>}
   */
  getWeapons(): Observable<Weapon[]> {
    return this.db.collection<Weapon>('weapons').valueChanges()
      .pipe(
        map(weapons => Weapon.fromJSONArray(weapons)),
        tap(weapons => this.log(`fetched weapons`)),
        catchError(this.handleError('getWeapons', []))
      );
  }

  /**
   * Retourne les armes correspondantes au tableau d'ids passé en paramètre
   * @param {number[]} ids
   * @returns {Observable<Weapon[]>}
   */
  getWeaponsFromIds(ids: number[]): Observable<Weapon[]> {
    return this.db.collection<Weapon>('weapons').valueChanges()
      .pipe(
        map(weapons => Weapon.fromJSONArray(weapons).filter(weapon => ids.indexOf(weapon.id) !== -1)),
        catchError(this.handleError('getWeaponsFromIds', []))
      );
  }

  /* GET weapon by id. Will 404 if id not found */
  getWeapon(id: number): Observable<Weapon> {
    return this.db.collection<Weapon>('weapons').doc(id.toString()).valueChanges().pipe(
      map(weapon => Weapon.fromJSON(weapon)),
      tap(_ => this.log(`fetched weapon id=${id}`)),
      catchError(this.handleError<Weapon>(`getWeapon id=${id}`))
    );
  }

  /** PUT: update the weapon on the server */
  updateWeapon (weapon: Weapon): Observable<any> {
    return Observable.fromPromise<any>(this.db
      .collection<Weapon>('weapons')
      .doc(weapon.id.toString())
      .set(Object.assign({}, weapon.getJSONObject())))
      .pipe(
        map(h => weapon),
        tap(_ => this.log(`updated weapon id=${weapon.id}`)),
        catchError(this.handleError<any>('updateWeapon'))
      );
  }

  /** POST: add a new weapon to the server */
  addWeapon (name: string): Observable<Weapon> {
    let id;
    return Observable.create(observer => {
      const subscription = this.generateId().subscribe(result => {
        id = result;
        const weapon = new Weapon(id, name);
        const added = Observable.fromPromise<any>(this.db
          .collection<Weapon>('weapons')
          .doc(id.toString())
          .set(Object.assign({}, weapon.getJSONObject())));
        observer.next(added);
        observer.complete();
      });
    }).pipe(
      tap(_ => this.log(`added weapon w/ id=${id}`)),
      catchError(this.handleError<Weapon>('addWeapon'))
    );
  }

  /** DELETE: delete the weapon from the server */
  deleteWeapon (weapon: Weapon | number): Observable<Weapon | number> {
    const id = typeof weapon === 'number' ? weapon : weapon.id;
    // On supprime l'arme pour chaque hero qui la possède
    this.heroService.getHeroes().subscribe(value => {
      const heroes = value;
      for (let i = 0; i < heroes.length; i++) {
        const removed = heroes[i].removeWeapon(id);
        if (removed) {
          this.heroService.updateHero(heroes[i]);
        }
      }
    });
    return Observable.fromPromise<any>(this.db.collection<Weapon>('weapons').doc(id.toString()).delete()).pipe(
      map(w => weapon),
      tap(_ => this.log(`deleted weapon id=${id}`)),
      catchError(this.handleError<Weapon>('deleteWeapon'))
    );
  }

  /* GET weapons whose name contains search term */
  searchWeapons(term: string): Observable<Weapon[]> {
    if (!term.trim()) {
      // if not search term, return empty weapon array.
      return of([]);
    }
    return this.db.collection<Weapon>('/weapons').valueChanges().pipe(
      map(weapons => Weapon.fromJSONArray(weapons).filter(weapon => !weapon.name.search(term))),
      tap(_ => this.log(`found weapons matching "${term}"`)),
      catchError(this.handleError<Weapon[]>('searchWeapons', []))
    );
  }

  /**
   * Récupère l'id d'arme le plus grand en BD, l'incrémente et retourne la valeur
   * @returns {Observable<number>}
   */
  private generateId(): Observable<number> {
    return this.db.collection<Weapon>('/weapons', ref => ref.orderBy('id', 'desc').limit(1))
      .valueChanges().take(1).pipe(
        map(value => (value[0] !== undefined ? Weapon.fromJSON(value[0]).id + 1 : 1))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a WeaponService message with the MessageService */
  private log(message: string) {
    this.messageService.add('WeaponService: ' + message);
  }

}
