import { testType } from './utils';
import _ from 'lodash';
import {
  ARRAYY_OPERATE,
} from './constant';
import { forDirective } from './directive';
import { BaseObj } from './domObj';

class DataUnit {
  protected data: any;
  protected pushList: Array<BaseObj | any>;
  protected type: String;

  constructor(data: any) {
    this.data = data;
    this.pushList = [];
    this.type = testType(data);

    this.dataInit(data);
  }

  /**
   * 异步
   * @param data 
   */
  protected dataInit(data) {
    // 数组和对象不进行数值初始化
    if (this.type === 'array' || this.type === 'object') {
    } else {
      setTimeout(() => {
        this.pushList && this.pushList.map((item, index) => {
          this.data = data;
          item.run && item.run(data, this.type, index, ARRAYY_OPERATE['add']);
        });
      }, 0);
    }
  }

  /**
   * 增加依赖
   * @param pushOrigin 
   */
  addPush(pushOrigin) {
    this.pushList.push(pushOrigin);
    this.pushList = _.uniq(this.pushList);
  }

  /**
   * 删除依赖
   * @param pushOrigin 
   */
  rmPush(pushOrigin) {
    this.pushList = _.difference(this.pushList, [pushOrigin]);
  }

  /**
   * 输出值
   * @param index 
   */
  outputData(index?: string): any {
    //深度取值
    if (
      index
      && testType(index) === 'string'
      && index.split('.').length > 1
    ) {
      return [this.data, ...index.split('.')].reduce((t, i) => {
        return t.outputData ? t.outputData(i) : t[i];
      });
    }
    //数组，无参数 => 取全部
    if (index === undefined && this.type === 'array') {
      return this.data.map(item => {
        return item;
      });
    }
    //对象，无参数 => 取全部
    if (index === undefined && this.type === 'object') {
      let _data = {};
      for (let i in this.data) {
        _data[i] = this.data[i];
      }
      return _data;
    }
    //有参数，数组或对象 => 取全部
    if (
      index !== undefined
      && (this.type === 'array' || this.type === 'object')
    ) {
      return this.data[index];
    }
    //非数组或对象 => 取基本值 
    if (this.type !== 'array' && this.type !== 'object') {
      return this.data;
    }
  }

  /**
   * 设置值
   * @param data 
   * @param name 
   */
  setData(data, name?: string): DataUnit {
    let isChanged = '';

    if (this.type === 'object' && name !== undefined) {
      this.outputData(name).setData(data);
    } else if (this.type === 'array' && name !== undefined) {
      this.outputData(name).setData(data);
    } else if (
      (this.type === 'object' || this.type === 'array')
      && name === undefined
    ) {
    } else {
      this.type = testType(data);
      this.data = data;
      isChanged = ARRAYY_OPERATE['set'];
    }

    //修改以后，推送值
    if (isChanged !== '') {
      this.pushList.map((item, index) => {
        item.run && item.run(this.data, this.type, index, ARRAYY_OPERATE['set']);
      });
    }
    return this;
  }

  /**
   * 析构函数😜
   */
  rmSelf() {
    for (let i in this) {
      this[i] = null;
    }
  }
}

class Arrayy extends DataUnit {
  protected data: Array<any>;
  protected pushList: Array<forDirective>;

  constructor(data: Array<any>) {
    super(data);
    this.pushList = [];
    this.data = this.dataInit(data);
    this.type = 'array';
  }

  protected dataInit(data: Array<any>): Array<DataUnit | Arrayy> {
    const _data = data.map((item, index) => dataFactory(item));
    // this.data = _data;
    return _data;
  }
  /**
   * 插入
   * @param index 插入位置
   * @param len 长度
   * @param data 新内容
   */
  splice(index: number, len: number, data) {
    const newData = dataFactory(data);
    this.data.splice(index, len, newData);
    return newData;
  }
  /**
   * 截取
   * @param index 取出位置
   * @param len 长度
   */
  private difference(index: number, len: number) {
    const newData = this.data.splice(index, len);
    return newData;
  }

  /**
   * 添加时推送（for指令专用）
   * @param newData 
   * @param index 
   */
  addCallback(newData, index) {
    this.pushList.map((item) => {
      item.addToList && item.addToList(newData, index);
    });
  }
  /**
   * 删除时推送
   * @param _data 
   * @param index 
   */
  rmCallback(_data, index) {
    _data.map(item => {
      item.rmSelf();
    });
    this.pushList.map((item) => {
      item.rmFromList && item.rmFromList(_data, index);
    });
  }

  push(tmp): Arrayy {
    const newData = this.splice(this.data.length, 0, tmp);
    this.addCallback(newData, this.data.length);
    return this;
  }

  pop() {
    const _data = this.difference(this.data.length, 1)
    this.data = _.difference(this.data, _data);
    this.rmCallback(_data, this.data.length);
    return _data;
  }

  unshift(tmp): Arrayy {
    const newData = this.splice(0, 0, tmp);
    this.addCallback(newData, 0);
    return this;
  }

  shift() {
    if (this.data.length === 0) return;
    const _data = this.difference(0, 1);
    this.data = _.difference(this.data, _data);
    this.rmCallback(_data, 0);
    return _data;
  }

  insertTo(tmp, index) {
    const newData = this.splice(index, 0, tmp);
    this.addCallback(newData, index);
    return this;
  }

  rmFrom(index) {
    const _data = this.difference(index, 1)
    this.data = _.difference(this.data, _data);
    this.rmCallback(_data, index);
    return _data
  }

  map(callback) {
    return this.data.map(callback);
  }

}




class Objecty extends DataUnit {
  protected data: Object;

  constructor(data: Array<any>) {
    super(data);
    this.pushList = [];
    this.data = this.dataInit(data);
    this.type = 'object';
  }

  protected dataInit(data: Array<any>): Object {
    let _data = {}
    for (let i in data) {
      _data[i] = dataFactory(data[i]);
    }
    return _data;
  }

  /**
   * 批量获取store
   * @param params 
   */
  getValues(...params) {
    const queue = [...params];
    const _data = {};
    queue.forEach(item => {
      _data[item] = this.outputData(item);
    });
    return _data;
  }


  // map(callback) {
  //   const answer = [];
  //   for (let i in this.data) {
  //     answer.push(callback(i));
  //   }
  //   return answer;
  // }

}




/**
 * 转换为DataUnit对象
 * @param data 
 */
function dataFactory(data) {
  const type = testType(data);
  if (type === 'array') {
    return new Arrayy(data);
  } else if (type === 'object') {
    return new Objecty(data);
  } else {
    const _data = new DataUnit(data);
    return _data;
  }
}

export { DataUnit, Arrayy, Objecty, dataFactory };