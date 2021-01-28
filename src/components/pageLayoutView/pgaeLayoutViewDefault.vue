<script>
/* eslint-disable no-unused-vars */
import Vue from 'vue';
import Component from 'vue-class-component';
import { State, Mutation } from 'vuex-class';

import Configuration from '@/configuration/configuration';
import VueDraggableResizable from '@/components/draggableResizable/draggableResizable.vue';
import { uuid, throttle, extend, toLine } from '@/utils/utils';

const configuration = new Configuration();
let _this = null;

@Component({
	components: { VueDraggableResizable },
	props: {
		isRuntime: Boolean
	}
})
class PageLayoutViewDefault extends Vue {
	@State('page') page
	@State('plugins') plugins
	@State('currentPlugins') currentPlugins
	@State('clipboard') clipboard

	@Mutation('updatePageProps') updatePageProps;
	@Mutation('addPlugin') addPlugin
	@Mutation('updateCurrentPlugins') updateCurrentPluginsFn
	@Mutation('updatePluginsProps') updatePluginsProps
	@Mutation('delPlugin') delPluginFn
	@Mutation('setClipboard') setClipboardFn
	@Mutation('setPluginsRef') setPluginsRefFn

	checkPlugin = false
	leftMenuList = [{
		id: '1',
		label: '剪切'
	}, {
		id: '2',
		label: '复制'
	}, {
		id: '3',
		label: '粘贴'
	}, {
		id: 'divider1',
		isDivider: true
	}, {
		id: '4',
		label: '删除'
	}]

	resizing = throttle((x, y, w, h) => {
		if (_this) {
			if (_this.currentPlugins.length) {
				_this.updatePluginsProps({ id: _this.currentPlugins[0].id, modify: { id: 'custom.x', value: x } });
				_this.updatePluginsProps({ id: _this.currentPlugins[0].id, modify: { id: 'custom.y', value: y } });
				_this.updatePluginsProps({ id: _this.currentPlugins[0].id, modify: { id: 'custom.width', value: w } });
				_this.updatePluginsProps({ id: _this.currentPlugins[0].id, modify: { id: 'custom.height', value: h } });
			}
		}
	}, 500)
	dragging = throttle((x, y) => {
		if (_this) {
			if (_this.currentPlugins.length) {
				_this.currentPlugins[0] && _this.updatePluginsProps({ id: _this.currentPlugins[0].id, modify: { id: 'custom.x', value: x } });
				_this.currentPlugins[0] && _this.updatePluginsProps({ id: _this.currentPlugins[0].id, modify: { id: 'custom.y', value: y } });

				_this.currentPlugins[0] && _this.detectingContainerCompoents();
			}
		}
	}, 500)
	activatedFn(id) {
		this.updateCurrentPluginsFn(this.plugins.filter(item => item.id === id));
		this.checkPlugin = true;
	}
	deactivatedFn() {
		this.checkPlugin = false;
		this.updateCurrentPluginsFn([]);
	}
	detectingContainerCompoents() {
		const containerComponents = _this.plugins.filter(item => item.key === 'kaContainerLayout');
		// 横向求重叠公式: (right1-left1)+(right2-left2) - ( max(right1,right2) - min(left1,left2) )
		const left2 = _this.currentPlugins[0].custom.x;
		const right2 = _this.currentPlugins[0].custom.x + _this.currentPlugins[0].custom.width;

		const top2 = _this.currentPlugins[0].custom.y;
		const bottom2 = _this.currentPlugins[0].custom.y + _this.currentPlugins[0].custom.height;

		let i = 0;

		for (let len = containerComponents.length; i < len; i++) {
			const item = containerComponents[i];

			const left1 = item.custom.x;
			const right1 = item.custom.x + item.custom.width;

			const top1 = item.custom.y;
			const bottom1 = item.custom.y + item.custom.height;

			// 计算重叠矩形宽度和高度
			const areaW = (right1 - left1) + (right2 - left2) - (Math.max(right1, right2) - Math.min(left1, left2));
			const areaH = (bottom1 - top1) + (bottom2 - top2) - (Math.max(bottom1, bottom2) - Math.min(top1, top2));
			// 遮挡矩形面积
			const area = areaW * areaH;
			// 遮挡矩形面积大于等于 当前拖拽组件面积一半 就把当前组件添加到该容器中
			if (areaW > 0 && areaH > 0 && area >= _this.currentPlugins[0].custom.width / 2 * _this.currentPlugins[0].custom.height) {
				if ((item.id!==_this.currentPlugins[0].id) && !item.children.find(item => item.id === _this.currentPlugins[0].id)) {
					const copyPlugins = [..._this.currentPlugins];
					copyPlugins[0].custom.x = 0;
					copyPlugins[0].custom.y = 0;
					_this.updatePluginsProps({ id: item.id, modify: { id: 'children', value: [...item.children, ...copyPlugins] } });
					_this.delPluginFn(_this.currentPlugins[0].id);
					_this.updateCurrentPluginsFn(copyPlugins);
				}
				break;
			}
		}
	}
	createLeftMenu(h) {
		return <v-contextmenu ref="contextmenu">
			{this.leftMenuList.map(item => {
				if (item.isDivider) {
					return <v-contextmenu-item divider></v-contextmenu-item>;
				}
				return <v-contextmenu-item key={item.id} onClick={(vm, e) => this.$emit('leftMenuClick', item)}>{item.label}</v-contextmenu-item>;
			})}
		</v-contextmenu>;
	}
	createRoot(h, item, children) {
		const style = {
			paddingTop: item.style.paddingTop / 20 + 'rem',
			paddingBottom: item.style.paddingBottom / 20 + 'rem',
			paddingLeft: item.style.paddingLeft / 20 + 'rem',
			paddingRight: item.style.paddingRight / 20 + 'rem',
			borderWidth: item.style.borderWidth / 20 + 'rem',
			borderStyle: item.style.borderStyle,
			borderColor: item.style.borderColor,
			backgroundColor: item.style.backgroundColor
		};

		const currentPluginsId = this.currentPlugins && this.currentPlugins[0] && this.currentPlugins[0].id;

		return <VueDraggableResizable
			class={item.children ? 'designer-content-drag container-components' : 'designer-content-drag'}
			key={item.id}
			w={item.custom.width}
			h={item.custom.height}
			x={item.custom.x}
			y={item.custom.y}
			active={currentPluginsId === item.id}
			parent
			snap={false}
			minHeight={10}
			parentSelector=".page-layout-view-default"
			drag-handle={item.children ? '.drag-handle' : ''}
			onResizing={this.resizing}
			onDragging={this.dragging}
			onActivated={() => this.activatedFn(item.id)}
			onDeactivated={this.deactivatedFn}
		>
			{item.children && <div class="drag-handle">
				<i class="iconfont icontuozhuai" />
				<span class="drag-handle--label">拖动区域</span>
			</div>}
			<div class="designer-content-drag-proxy" id={item.id} style={style}>
				{children}
			</div>
		</VueDraggableResizable>;
	}
	createComponentsItems(h) {
		const getComponentStyle = (item) => {

			return {
				paddingTop: item.style.paddingTop / 20 + 'rem',
				paddingBottom: item.style.paddingBottom / 20 + 'rem',
				paddingLeft: item.style.paddingLeft / 20 + 'rem',
				paddingRight: item.style.paddingRight / 20 + 'rem',
				borderWidth: item.style.borderWidth / 20 + 'rem',
				borderStyle: item.style.borderStyle,
				borderColor: item.style.borderColor,
				backgroundColor: item.style.backgroundColor,
				position: 'absolute',
				left: item.custom.x / 20 + 'rem',
				top: item.custom.y / 20 + 'rem',
				flex: (item.custom.width && item.custom.height) ? 0 : 1,
				width: +item.custom.width ? (+item.custom.width / 20 + 'rem') : item.custom.width,
				height: +item.custom.height ? (+item.custom.height / 20 + 'rem') : item.custom.height
			};
		};
		if (this.isRuntime) {
			return this.plugins.map(item => {
				return (
					<div id={item.id} style={getComponentStyle(item)}>
						{h(item.key, { key: item.id, ref: item.id, props: { options: item.props, children: item.children, custom: item.custom } })}
					</div>
				);
			});
		}

		return this.plugins.map(item => this.createRoot(h, item, h(item.key, { key: item.id, ref: item.id, props: { options: item.props, children: item.children, custom: item.custom }, directives: [{ name: 'contextmenu', arg: 'contextmenu' }] })));
	}
	mounted() {
		_this = this;
		this.setPluginsRefFn(this.$refs);
		window.Uidesigner.$refs = Object.assign({}, this.$refs);
	}

	render(h) {
		return <div class="page-layout-view-default" >
			{!this.isRuntime && this.createLeftMenu(h)}
			{this.createComponentsItems(h)}
		</div>;
	}
}
export default PageLayoutViewDefault;

</script>

<style lang="scss">
.page-layout-view-default {
	width: 100%;
	height: 100%;
}
</style>

