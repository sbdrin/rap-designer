/**
 * 管理所有页面组件
 */
import Observer from '@/utils/observer';
import { uuid, extend } from '@/utils/utils';
export default class Plugins extends Observer {
  plugins: Array<any>;
  constructor() {
    super();
    this.plugins = [];
  }
  setPlugin(data: any) {
    this.plugins.push(this.addAttrs(Object.assign({}, data)));
    this.trigger('add-plugins');
    return this;
  }
  detPlugin(id: any) {
    if (!id) {
      this.plugins = [];
    }

    let [i, length] = [0, this.plugins.length];

    for (; i < length; i++) {
      if (this.plugins[i].id === id) {
        this.plugins.splice(i, 1);
        break;
      }
    }
    return this;
  }
  getPlguin(key: any) {
    if (key) return extend(true, [], this.plugins.filter(item => item.key === key));
    return extend(true, [], this.plugins);
  }
  addAttrs(data: { [x: string]: string; id: any; key: string; custom: any}) {
    if(!data.id) {
      data['id'] = data.key + '_' + uuid();
    }
    data.custom && (data.custom['id'] = data.id);
    return data;
  }
  setOption(option: { id: any; modify: { id: { match: (arg0: RegExp) => undefined; }; value: any; }; }) {
    let [i, length] = [0, this.plugins.length];

    for (; i < length; i++) {
      let item = this.plugins[i];
      if (item.id === option.id) {
        let ary:any = option.modify.id.match(/\w+|\d+/g);
        let last = ary.pop();

        let obj = ary.reduce((a: { [x: string]: any; }, b: string | number) => a[b], item);

        if (obj) {
          obj[last] = option.modify.value;
        }
        break;
      }
    }
    return this;
  }
}
