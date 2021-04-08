import *  as dayjs from 'dayjs';
import * as _ from 'lodash';
import { construct } from '@aximario/json-tree';

export class Utils {
  static now() {
    return dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
  }

  static dto2entity(dto: any, entity: any): any {
    let e = {};
    for (const key in entity) {
      if (dto.hasOwnProperty(key)) {
        e[key] = dto[key];
      }
    }
    return e;
  }

  static isBlank(a) {
    return a === '' || a === null || a === undefined;
  }

  static isNotBlank(a) {
    return this.isBlank(a);
  }

  static isEmpty(...args) {
    return _.isEmpty(...args);
  }

  static isNil(...args) {
    return _.isNil(...args);
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
