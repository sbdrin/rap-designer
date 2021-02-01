import Vue from 'vue';
import Vuex from 'vuex';
import { uuid, extend } from '@/utils/utils';
import page from '@/utils/page';
const pageIns = page;

(window.Uidesigner || (window.Uidesigner = {})) && (window.Uidesigner.pageIns = pageIns);
Vue.use(Vuex);

export default new Vuex.Store<any>({
	state: {
		page: pageIns, // 暂时不支持多页面 page类里面考虑了多页面
		plugins: {
			sortArr: []
		},
		currentPlugins: [],
		perviewHtml: '',
		defaultThemeColor: '#42b983',
		clipboard: [], // 存储剪贴板数据
		pluginsRefs: {} // 存储组件ref引用
	},
	mutations: {
		updatePageProps(state, options) {
			pageIns.updatePage(options);
		},
		addPlugin(state, options) {
			options.id = options.key + '_' + uuid();
			state.plugins = pageIns.addPlugin(options);
			state.currentPlugins = [state.plugins[options.id]];
		},
		delPlugin(state, id) {
			state.plugins = pageIns.delPlugin(id);
			state.currentPlugins = [];
		},
		updatePluginsProps(state, options) {
			state.plugins = pageIns.updatePlugin(options);
			state.currentPlugins[0] && (state.currentPlugins = [state.plugins[state.currentPlugins[0].id]]);
		},
		updateCurrentPlugins(state, id) {
			state.currentPlugins = extend(true, [], [state.plugins[id]]);
		},
		resetCurrentPlugins(state, opts) {
			state.currentPlugins = [];
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
