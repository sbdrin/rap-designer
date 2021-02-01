/**
 * 页面管理
 */
import Observer from '@/utils/observer';
import { uuid, extend } from '@/utils/utils';
import DEFALUT_CONFIG from '@/configuration/commonConfig/pageConfig';

class Page extends Observer {
	id: string = 'page_' + uuid()
	style: any = Object.assign({}, DEFALUT_CONFIG.style)
	options: any = DEFALUT_CONFIG.options;
	plugins: { 
		sortArr: Array<string>;
		[key: string]: any;
		} = { sortArr: [] };
	/** 
	 * options: {id: 'page_1464b0741ab0a9db', modify: {id: 'style.w', value: '1350'}}
	 */
	updatePage(option: { id: any; modify: { id: { match: (arg0: RegExp) => undefined }; value: any } }) {
		if (this.id === option.id) {
			const ary: any = option.modify.id.match(/\w+|\d+/g);
			const last = ary.pop();
			const obj = ary.reduce((a: { [x: string]: any }, b: string | number) => a[b], this);
			if (obj) {
				obj[last] = option.modify.value;
			}
		}
		return this;
	}
	addPlugin(data: any) {
		if(!data.id) {
			data.id = data.key + '_' + uuid();
		  }
		this.plugins.sortArr.push(data.id);
		this.plugins[data.id] = data;
		return this.plugins;
	}
	_delPlugin(id: string, arr: Array<any>): boolean{
		for(const i in arr){
			const _id = arr[i];
			if(_id == id){
				arr.splice(+i, 1);
				return false;
			}else if(typeof _id == 'object'){
				return this._delPlugin(id, _id);
			}
		}
		return true;
	}
	delPlugin(id: string) {
		delete this.plugins['' + id];
		this._delPlugin(id, this.plugins.sortArr);
		return this.plugins;
	}
	updatePlugin(option: { id: string; modify: any}) {
		const plugin = this.plugins[option.id];
		const ary: any = option.modify.id.match(/\w+|\d+/g);
		const last = ary.pop();
		const obj = ary.reduce((a: { [x: string]: any }, b: string | number) => a[b], plugin);
		if (obj) {
			obj[last] = option.modify.value;
		}
		return this.plugins;
	}
}
const page = new Page();
export default page;