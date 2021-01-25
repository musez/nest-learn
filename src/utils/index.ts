import * as _ from 'lodash';
import { construct } from '@aximario/json-tree';

export class Utils {
  static dto2entity(dto: any, entity: any): any {
    let e = {};
    for (const key in entity) {
      if (dto.hasOwnProperty(key) && (dto[key] || dto[key] === 0)) {
        e[key] = dto[key];
      }
    }
    return e;
  }

  static isEmpty(...args) {
    return _.isEmpty(...args);
  }

  static uniqBy(...args) {
    return _.uniqBy(...args);
  }

  static assign(...args) {
    return _.assign(...args);
  }

  static concat(...args) {
    return _.concat(...args);
  }

  static construct(...args) {
    return construct(...args);
  }
}
