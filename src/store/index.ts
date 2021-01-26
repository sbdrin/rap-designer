import Vue from 'vue';
import Vuex from 'vuex';
import { extend } from '@/utils/utils';
import Page from '@/utils/page';
const pageIns = new Page();

(window.Uidesigner || (window.Uidesigner = {})) && (window.Uidesigner.pageIns = pageIns);
Vue.use(Vuex);

export default new Vuex.Store<any>({
	state: {
		page: pageIns.page[0], // 暂时不支持多页面 page类里面考虑了多页面
		plugins: [],
		currentPlugins: [],
		perviewHtml: '',
		defaultThemeColor: '#42b983',
		clipboard: [], // 存储剪贴板数据
		pluginsRefs: {} // 存储组件ref引用
	},
	mutations: {
		updatePageProps(state, options) {
			state.page = pageIns.updatePage(options).page[0];
		},
		addPlugin(state, options) {
			state.plugins = pageIns.addPlugin({ pageId: state.page.id, options });
		},
		delPlugin(state, id) {
			state.plugins = pageIns.delPlugin({ pageId: state.page.id, pluginId: id });
			state.currentPlugins = [];
		},
		updatePluginsProps(state, options) {
			state.plugins = pageIns.updatePlugin({ pageId: state.page.id, options });
			state.currentPlugins[0] && (state.currentPlugins = state.plugins.filter((item: any) => item.id === (state.currentPlugins[0]as any).id));
		},
		updateCurrentPlugins(state, options) {
			state.currentPlugins = [];
			state.currentPlugins = extend(true, [], options);
		},
		setPerviewHtml(state, html) {
			state.perviewHtml = html;
		},
		setClipboard(state, data) {
			state.clipboard = [];
			state.clipboard = extend(true, [], data);
		},
		setPluginsRef(state, data) {
			state.pluginsRefs = data;
		}
	},
	actions: {}
});
