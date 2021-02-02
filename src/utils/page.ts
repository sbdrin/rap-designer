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
		sortArr: Array<any>;
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
		data.custom.id = data.id;
		this.plugins.sortArr.push({ id: data.id, label: data.custom.name });
		this.plugins[data.id] = data;
		return this.plugins;
	}
	delPlugin(id: string) {
		delete this.plugins['' + id];
		this._findPlugin(id, this.plugins.sortArr, true);
		return this.plugins;
	}
	_findPlugin(id: any, arr: Array<any>, willRemove?: boolean): any{
		for(const i in arr){
			const item = arr[i];
			if(item.id == id){
				willRemove && arr.splice(+i, 1);
				return item;
			}else if(item.children){
				const result = this._findPlugin(id, item.children, willRemove);
				if(result){
					return result;
				}
			}
		}
	}
	updatePlugin(option: { id: string; modify: any}) {
		if(option.modify.id == 'children'){
			this._findPlugin(option.modify.value[0].id, this.plugins.sortArr, true);
			const item = this._findPlugin(option.id, this.plugins.sortArr);
			item.children = (item.children || []).concat([{ id: option.modify.value[0].id, label: option.modify.value[0].custom.name }]);
			return this.plugins;
		}
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