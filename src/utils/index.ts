import * as dayjs from 'dayjs';
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
      charSet ||
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    // tslint:disable-next-line:no-shadowed-variable
    let randomString = '';
    for (let i = 0; i < length; i++) {
      const randomPoz = Math.floor(Math.random() * charSet.length);
      randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
  };

  static split(str: string, sp = ',') {
    return str.split(sp);
  }

  static join(arr: [], sp = ',') {
    return arr.join(sp);
  }

  static now() {
    return dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
  }

  static dayjsFormat(format: string) {
    return dayjs(Date.now()).format(format);
  }

  static dayjsGetDay(day: number) {
    const days = [];
    for (let i = 1; i <= day; i++) {
      days.push(dayjs().add(i, 'day').format('YYYY-MM-DD'));
    }

    return days;
  }

  static dayjsGetWeekday() {
    return this.dayjsGetDay(7);
  }

  static dayjsGetMonth() {
    return this.dayjsGetDay(30);
  }

  static dayjsGetYear() {
    return this.dayjsGetDay(365);
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

  static isArray(...args) {
    return _.isArray(...args);
  }

  static concat(...args) {
    return _.concat(...args);
  }

  static flatMapDeep(...args) {
    return _.flatMapDeep(...args);
  }

  static construct(...args) {
    return construct(...args);
  }

  static handleDbRet({ fn, argus, iRet, result, err }, dbRow2Obj = false) {
    const ret = dbRow2Obj ? JSON.parse(result) : result;
    return ret;
  }

  static handleNestRet(ret) {
    return ret;
  }

  /**
   * 通用的打开下载对话框方法，没有测试过具体兼容性
   * @param url 下载地址，也可以是一个blob对象，必选
   * @param saveName 保存文件名，可选
   */
  static openDownloadDialog(url, saveName) {
    if (typeof url == 'object' && url instanceof Blob) {
      url = URL.createObjectURL(url); // 创建blob地址
    }
    const aLink = document.createElement('a');
    aLink.href = url;
    aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
    let event;
    if (window.MouseEvent) event = new MouseEvent('click');
    else {
      event = document.createEvent('MouseEvents');
      event.initMouseEvent(
        'click',
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null,
      );
    }
    aLink.dispatchEvent(event);
  }

  /**
   * 根据 ID 获取该节点的所有父节点的对象
   */
  static getParentId(list, id) {
    for (let i in list) {
      if (list[i].id == id) {
        return [list[i]];
      }
      if (list[i].children) {
        let node = this.getParentId(list[i].children, id);
        if (node !== undefined) {
          return node.concat(list[i]);
        }
      }
    }
  }

  /**
   * 根据 ID 获取该节点的对象
   */
  static getId(list, id) {
    for (let i in list) {
      if (list[i].id == id) {
        return [list[i]];
      }
      if (list[i].children) {
        let node = this.getParentId(list[i].children, id);
        if (node !== undefined) {
          return node;
        }
      }
    }
  }

  /**
   * 根据 ID 获取所有子节点的对象，首先把该节点的对象找出来，上面 getId() 这个方法
   */
  static getNodeId(list, newNodeId = []) {
    for (let i in list) {
      newNodeId.push(list[i]);
      if (list[i].children) {
        this.getNodeId(list[i].children, newNodeId);
      }
    }
    return newNodeId;
  }
}
