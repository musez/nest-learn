import *  as dayjs from 'dayjs';
import * as _ from 'lodash';
import { construct } from '@aximario/json-tree';

export class Utils {
  /**
   * 生成随机字符串
   * @param {number} length 生成长度
   * @param {string} charSet 指定字符集
   * @returns {string} 生成字符串
   */
  static randomString = (length: number = 8, charSet?: string): string => {
    charSet =
      charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    // tslint:disable-next-line:no-shadowed-variable
    let randomString = '';
    for (let i = 0; i < length; i++) {
      const randomPoz = Math.floor(Math.random() * charSet.length);
      randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
  };

  static now() {
    return dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
  }

  static dayjsFormat(format) {
    return dayjs(Date.now()).format(format);
  }

  static dayjsGetDay(day) {
    console.log('day:',day);
    const days = [];
    for (let i = 1; i <= day; i++) {
      days.push(dayjs().add(day, 'day'));
    }

    return days;
  }

  static dayjsGetWeekday() {
    return;
  }

  static dayjsGetMonth(format) {
    return;
  }

  static dayjsGetYear(format) {
    return;
  }

  static dto2entity(dto: any, entity: any): any {
    const e = {};
    for (const key in entity) {
      if (dto.hasOwnProperty(key)) {
        e[key] = dto[key];
      }
    }
    return e;
  }

  static dto2entityImport(dto: any, entity: any): any {
    const e = {};
    for (const key in entity) {
      if (dto.hasOwnProperty(key) && dto[key] !== '') {
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
