import * as _ from 'lodash';
import { construct } from '@aximario/json-tree';

export class Utils {
  static dto2entity(dto: any, entity: any) {
    for (const key in entity) {
      if (dto.hasOwnProperty(key)) {
        entity[key] = dto[key];
      }
    }
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
