export class RedisUtil {
  /**
   * redis 数据转换成 map
   */
  static arrayToMap(array: []) {
    const map = new Map();
    for (let i = 0; i < array.length; i += 2) {
      /* istanbul ignore if */
      if (array[i] === null || array[i] === undefined || array[i + 1] === null || array[i + 1] === undefined) {
        return null;
      }
      map.set(array[i], array[i + 1]);
    }
    return map;
  };

  /**
   * map 数据转换成 list
   */
  static mapToList(map: Map<any, any>) {
    return [...map.keys()].map(v => {
      return {
        key: v,
        value: map.get(v),
      };
    });
  };
}
