import Vue from 'vue';
import Component from 'vue-class-component';
import designerArea from '@/components/designerContent/designerContent.vue';
import componentsList from '@/components/componentsList/componentsList.vue';
import pageFormView from '@/components/pageFormView/pageFormView.vue';
import { State, Mutation } from 'vuex-class';
import { Watch } from '@/modules/vuePropertyDecorator/vuePropertyDecorator';
import { extend } from '@/utils/utils';
import page from '@/utils/page';
import configuration from '@/configuration/configuration';
import EventSetting from '@/components/eventSetting/eventSetting.vue';

const componentConfig = configuration;

@Component({
	name: 'desigenerPage',
	components: { designerArea, componentsList, pageFormView, EventSetting }
})
class DesigenerPage extends Vue {
	@State('plugins') plugins;
	@State('currentPlugins') currentPlugins;

	@Mutation('updatePageProps') updatePageProps;
	@Mutation('updatePluginsProps') updatePluginsProps;
	@Mutation('setPerviewHtml') setPerviewHtml;
	@Mutation('updateCurrentPlugins') updateCurrentPluginsCb;

	@Watch('plugins.sortArr', { deep: true, immediate: true })
	updateComponentsTree(newValue) {
		this.componentList = extend(true, [], newValue);
	}
	@Watch('currentPlugins', { deep: true, immediate: true })
	updateCurrentPluginsFn(newValue, oldValue) {
		const ids = ['custom.width', 'custom.height', 'custom.x', 'custom.y', 'style.position', 'style.paddingTop', 'style.paddingBottom', 'style.paddingLeft', 'style.paddingRight', 'style.borderWidth', 'style.borderStyle', 'style.borderColor', 'style.backgroundColor'];
		const labels = ['尺寸', '位置', '样式配置'];
		if (newValue[0]) {
			newValue[0].options.map((item) => {
				if (item && item.type === 'inputNumber' && item.options) {
					item.id === 'custom.x' && (item.options.max = page.style.w);
					item.id === 'custom.y' && (item.options.max = page.style.h);
					item.id === 'custom.width' && (item.options.max = page.style.w);
					item.id === 'custom.height' && (item.options.max = page.style.h);
				}
				if (item && (ids.indexOf(item.id) > -1 || labels.indexOf(item.label) > -1)) {
					item.hidden = false;
				}
			});
			this.currentPluginOptions = extend(true, {}, newValue[0]);

			if (newValue[0] && typeof newValue[0].custom.dataConfig !== 'undefined') {
				const copyCurrentPluginOptions = extend(true, {}, newValue[0]);
				copyCurrentPluginOptions.options = copyCurrentPluginOptions.custom.dataConfig;
				this.dataSettingCurrentPluginOptions = extend(true, {}, copyCurrentPluginOptions);
			}
			this.$nextTick(() => {
				this.$refs.componentTree && this.$refs.componentTree.setCurrentKey(newValue.find((item) => item.id));
			});
			this.collapseValue = '2';
		} else {
			this.currentPluginOptions = {};
			this.dataSettingCurrentPluginOptions = {};
			this.$nextTick(() => {
				this.$refs.componentTree && this.$refs.componentTree.setCurrentKey();
			});
			this.collapseValue = '1';
			this.componentTabs = '1';
		}
	}
	updatePage() {
		page.options.map((item) => {
			item.hidden = false;
			if (item.type === 'tips') {
				item.label = '提示:宽度大小建议为1920,1600,1366,1440,1280';
			}
		});
		this.pageOptions = extend(true, {}, page);
	}

	logo = require('../../assets/logo1.png');
	componentTabs = '1';
	collapseValue = '1';
	componentList = [];
	currentPluginOptions = {};
	dataSettingCurrentPluginOptions = {}; // 数据设置组件配置
	pageOptions = {};
	componentData = {};
	componentTitleMap = {
		basis: '基础组件',
		chart: '图表组件'
	};

	updatePluginsPropsFn(data) {
		this.updatePluginsProps(data);
	}

	componentNodeClick(nodeObj) {
		this.updateCurrentPluginsCb(nodeObj.id);
	}

	updatePageFn(data) {
		// 切换布局方式 重置选中组件, 让右侧属性面板重新刷新
		// if (data.modify.id === 'style.layoutStyle') {
		// 	this.updateCurrentPluginsCb([]);
		// }
		this.updatePageProps(data);
	}

	preview() {
		// const _html = document.querySelector('#pageCanvasContainer');

		// this.setPerviewHtml(_html.innerHTML);
		this.$router.push({ name: 'perview' });
	}
	release() {
		this.save('release').then(() => {
			const loadingNotify = this.$notify.info({
				title: '提示',
				duration: 0,
				showClose: false,
				message: '模版生成中,请稍后...'
			});

			this.$http
				.post('/api/release', {
					page: JSON.stringify(this.$store.state.page, (key, value) => {
						if (typeof value === 'function') {
							return value.toString();
						}
						return value;
					}),
					terminal: navigator.platform.indexOf('Mac') > -1 ? 'mac' : 'windows'
				})
				.then(
					(data) => {
						loadingNotify.close();
						this.$notify({
							title: '成功',
							message: '模版生成成功',
							type: 'success'
						});
						// this.$http.post('/api/install');
					},
					(err) => {
						loadingNotify.close();
						this.$notify.error({
							title: '错误',
							message: '模版生成失败,' + err.data.msg
						});
					}
				);
		});
	}
	save(type) {
		return new Promise((resolve) => {
			window.localStorage.setItem(
				'pagePlugins',
				JSON.stringify(this.$store.state.plugins, (key, value) => {
					if (typeof value === 'function') {
						return value.toString();
					}
					return value;
				})
			);
			type !== 'release' &&
				this.$alert('数据保存成功', '提示', {
					confirmButtonText: '确定'
				});
			resolve();
		});
	}
	handleClick() {
		// this.$refs.pageComponentBasisScrollbar.update()
	}

	mounted() {
		const obj = {};
		componentConfig.options.map((item) => {
			if (item.type) {
				if (!obj[item.type]) {
					obj[item.type] = [];
				}
				obj[item.type].push(item);
			} else {
				if (!obj.basis) {
					obj.basis = [];
				}
				obj.basis.push(item);
			}
		});
		this.componentData = Object.assign({}, obj);
		this.$nextTick(() => {
			const $$desigenerPage = document.querySelector('.desigener-page');
			const minW = $$desigenerPage.offsetWidth;
			const minH = $$desigenerPage.offsetHeight;
			// 当前屏幕尺寸大于页面设置默认值就使用当前屏幕值作为默认值使用
			if (page.style.w < minW || page.style.h < minH) {
				this.updatePageProps({
					id: page.id,
					modify: { id: 'style', value: Object.assign({}, page.style, { w: minW, h: minH }) }
				});
				this.updatePage();
			}
		});
	}
}

export default DesigenerPage;
