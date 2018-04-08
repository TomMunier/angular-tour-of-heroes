import { InMemoryDbService } from 'angular-in-memory-web-api';
import {Hero} from './model/hero';
import {Weapon} from './model/weapon';

/**
 * Inutilisé depuis mise en place de Firebase Database
 */
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const heroes = [
      /*new Hero(11, 'Mr. Nice').getJSONObject(),
      new Hero(12, 'Narco', 15, 5, 15, 5).getJSONObject(),
      new Hero(13, 'Bombasto', 5, 15, 5, 15).getJSONObject(),
      new Hero(14, 'Celeritas', 15, 15, 5, 5).getJSONObject(),
      new Hero(15, 'Magneta', 5, 5, 15, 15).getJSONObject(),
      new Hero(16, 'RubberMan', 15, 5, 5, 15).getJSONObject(),
      new Hero(17, 'Dynama', 5, 15, 15, 5).getJSONObject(),
      new Hero(18, 'Dr IQ', 18, 3, 15, 4).getJSONObject(),
      new Hero(19, 'Magma', 6, 2, 12, 20).getJSONObject(),
      new Hero(20, 'Tornado', 10, 22, 5, 3).getJSONObject()*/
    ];
    const weapons = [
      /*new Weapon(1, 'Lance flamme', 0, 5, -5, 0).getJSONObject(),
      new Weapon(2, 'Carapace verte', 0, 5, -5, 0).getJSONObject(),
      new Weapon(3, 'Boule de pétanque', 0, 5, -5, 0).getJSONObject(),
      new Weapon(4, 'Batte de baseball', 0, 5, -5, 0).getJSONObject(),
      new Weapon(5, 'Lucille', 0, 5, -5, 0).getJSONObject(),
      new Weapon(6, 'Sabre laser', 0, 5, -5, 0).getJSONObject(),
      new Weapon(7, 'Golden gun', 0, 5, -5, 0).getJSONObject(),
      new Weapon(8, 'Tronconneuse', 0, 5, -5, 0).getJSONObject(),
      new Weapon(9, 'Couteau de boucher', 0, 5, -5, 0).getJSONObject(),
      new Weapon(10, 'Poêle', 0, 5, -5, 0).getJSONObject()*/
    ];
    return {heroes, weapons};
  }
}
