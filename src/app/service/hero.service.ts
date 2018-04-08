import { Injectable } from '@angular/core';
import { Hero } from '../model/hero';
// import { HEROES } from '../data/mock-heroes';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import {AngularFirestore} from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import 'rxjs/add/operator/take';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class HeroService {

  private db: AngularFirestore; // Firebase

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    db: AngularFirestore) { this.db = db; }

  /* GET all heroes from database */
  getHeroes(): Observable<Hero[]> {
    return this.db.collection<Hero>('heroes').valueChanges()
      .pipe(
        map(heroes => Hero.fromJSONArray(heroes)),
        tap(heroes => this.log(`fetched heroes`)),
        catchError(this.handleError('getHeroes', []))
      );
  }

  /* GET hero by id. Will 404 if id not found */
  getHero(id: number): Observable<any> {
    return this.db.collection<Hero>('heroes').doc(id.toString()).valueChanges().pipe(
      map(hero => Hero.fromJSON(hero)),
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /** PUT: update the hero on the server */
  updateHero (hero: Hero): Observable<Hero> {
    return Observable.fromPromise<any>(this.db
      .collection<Hero>('heroes')
      .doc(hero.id.toString())
      .set(Object.assign({}, hero.getJSONObject())))
    .pipe(
      map(h => hero),
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /** POST: add a new hero to the server */
  addHero (/*hero: Hero*/ name: string): Observable<Hero> {
    let id;
    return Observable.create(observer => {
      const subscription = this.generateId().subscribe(result => {
        id = result;
        const hero = new Hero(id, name);
        const added = Observable.fromPromise<any>(this.db
          .collection<Hero>('heroes')
          .doc(id.toString())
          .set(Object.assign({}, hero.getJSONObject())));
        observer.next(added);
        observer.complete();
      });
    }).pipe(
      tap(_ => this.log(`added hero w/ id=${id}`), e => this.log('not added ?')),
      catchError(this.handleError<Hero>('addHero')));
  }

  /** DELETE: delete the hero from the server */
  deleteHero (hero: Hero | number): Observable<Hero | void> {
    const id = typeof hero === 'number' ? hero : hero.id;
    return Observable.fromPromise(this.db.collection<Hero>('heroes').doc(id.toString()).delete()).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    // return this.http.get<Hero[]>(`api/heroes/?name=${term}`).pipe(
    return this.db.collection<Hero>('/heroes').valueChanges().pipe(
      map(heroes => Hero.fromJSONArray(heroes).filter(hero => hero.name.toLowerCase().includes(term.toLowerCase()))),
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
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

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }

  /**
   * Récupère l'id de héro le plus grand en BD, l'incrémente de 1 et retourne la valeur
   * @returns {Observable<number>}
   */
  private generateId(): Observable<number> {
    return this.db.collection<Hero>('/heroes', ref => ref.orderBy('id', 'desc').limit(1))
      .valueChanges().take(1).pipe(
        map(value => (value[0] !== undefined ? Hero.fromJSON(value[0]).id + 1 : 1))
      );
  }

}
