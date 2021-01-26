/**
 * 页面管理
 */
import Observer from '@/utils/observer';
import Plugins from '@/utils/plugins';
import { uuid, extend } from '@/utils/utils';
import DEFALUT_CONFIG from '@/configuration/commonConfig/pageConfig';
let ins: Page | null = null;

export default class Page extends Observer {
	plugins: any;
	page: any;
	constructor() {
		super();
		if (!ins) {
			this.plugins = new Plugins();
			this.page = [
				{
					id: 'page_' + uuid(),
					plugins: [],
					style: Object.assign({}, DEFALUT_CONFIG.style),
					options: DEFALUT_CONFIG.options
				}
			];
			ins = this;
		}
		return ins;
	}
	createPage(pageData: any) {
		this.page.push(extend(true, {}, pageData));
	}
	findPage(pageId: any, cb: { (item: any): void; (item: any): void; (item: any): void; (arg0: any): void; }) {
		let i = 0;
		while (true) {
			if (this.page[i].id === pageId) {
				cb(this.page[i]);
				break;
			}
			i++;
		}
	}

	/** 
	 * options: {id: 'page_1464b0741ab0a9db', modify: {id: 'style.w', value: '1350'}}
	 */
	updatePage(option: { id: any; modify: { id: { match: (arg0: RegExp) => undefined; }; value: any; }; }) {
		let [i, length] = [0, this.page.length];

		for (; i < length; i++) {
			let item = this.page[i];
			if (item.id === option.id) {
				let ary:any = option.modify.id.match(/\w+|\d+/g);
				let last = ary.pop();

				const obj = ary.reduce((a: { [x: string]: any; }, b: string | number) => a[b], item);

				if (obj) {
					obj[last] = option.modify.value;
				}
				break;
			}
		}
		return this;
	}
	addPlugin(data: { pageId: any; options: any; }) {
		let plugins: never[] = [];
		const cb = (item: { plugins: any; }) => {
			item.plugins = plugins = this.plugins.setPlugin(data.options).getPlguin();
		};
		this.findPage(data.pageId, cb);
		return plugins;
	}
	delPlugin(data: { pageId: any; pluginId: any; }) {
		let plugins: never[] = [];
		const cb = (item: { plugins: any; }) => {
			item.plugins = plugins = this.plugins.detPlugin(data.pluginId).getPlguin();
		};
		this.findPage(data.pageId, cb);
		return plugins;
	}
	updatePlugin(data: { pageId: any; options: any; }) {
		let plugins: never[] = [];
		const cb = (item: { plugins: any; }) => {
			item.plugins = plugins = this.plugins.setOption(data.options).getPlguin();
		};
		this.findPage(data.pageId, cb);
		return plugins;
	}
}
