<script>
/* eslint-disable no-unused-vars */
import Vue from 'vue';
import Component from 'vue-class-component';
import { State, Mutation } from 'vuex-class';

import configuration from '@/configuration/configuration';
import VueDraggableResizable from '@/components/draggableResizable/draggableResizable.vue';
import pageCanvas from '@/components/pageCanvas/pageCanvas.vue';
import { uuid, throttle, extend, toLine } from '@/utils/utils';
import page from '@/utils/page';
import PageEventManage from '@/modules/pageEventManage/pageEventManage';
import PageLayoutViewDefault from '@/components/pageLayoutView/pgaeLayoutViewDefault.vue';

let _this = null;
@Component({
	components: { VueDraggableResizable, pageCanvas, PageLayoutViewDefault }
})
export default class DesignerArea extends Vue {
	@State('currentPlugins') currentPlugins
	@State('clipboard') clipboard
	@State('plugins') plugins
	@Mutation('addPlugin') addPlugin
	@Mutation('updatePluginsProps') updatePluginsProps
	@Mutation('delPlugin') delPluginFn
	@Mutation('setClipboard') setClipboardFn
	@Mutation('setPluginsRef') setPluginsRefFn

	pageEvent = null
	auxLineY = {}
	auxLineX = {}
	isLockPageEvent = false

	bindEvent() {
		this.pageEvent = new PageEventManage();

		this.pageEvent
			.register({ key: 'delete' }, this.delPluginCallback)
			.register({ key: 's', isCtrl: true }, this.savePageCallback)
			.register({ key: 'z', isCtrl: true }, this.cancelCallback)
			.register({ key: 'c', isCtrl: true }, this.copyPluginCallback)
			.register({ key: 'v', isCtrl: true }, this.pastePluginCallback);

		window.Uidesigner.$event.once('open_code_editor', (data) => {
			this.isLockPageEvent = data;
		});
	}
	delPluginCallback() {
		if (this.isLockPageEvent) return false;
		this.currentPlugins.length && this.delPluginFn(this.currentPlugins[0].id);
	}
	savePageCallback() {
		if (this.isLockPageEvent) return false;
	}
	cancelCallback() {
		if (this.isLockPageEvent) return false;
	}
	copyPluginCallback() {
		if (this.isLockPageEvent) return false;
		this.setClipboardFn(extend(true, [], this.currentPlugins));
	}
	pastePluginCallback() {
		if (this.isLockPageEvent) return false;
		if (this.clipboard && this.clipboard.length) {
			const orgData = this.clipboard[0].custom;
			const _id = this.clipboard[0].key + '_' + uuid();
			const _x = orgData.x + 10 > page.style.w ? page.style.w - orgData.w : orgData.x + 10;
			const _y = orgData.y + 10 > page.style.h ? page.style.h - orgData.h : orgData.y + 10;
			const _newPlugins = extend(true, {}, this.clipboard[0], { custom: { id: _id, x: _x, y: _y }, id: _id });

			// 更新剪贴板为当前复制后的组件
			this.setClipboardFn(extend(true, [], [_newPlugins]));
			this.addPlugin(_newPlugins);
		}
	}
	dragover(event) {
		event.preventDefault();
	}
	drop(event) {
		const data = event.dataTransfer.getData('componentsId');
		const id = /^([a-zA-Z]+)/.exec(data);
		let dropComponentsOption = null;

		id && (dropComponentsOption = configuration.getOption(id[0]));

		dropComponentsOption && dropComponentsOption.length && this.addPlugin(extend(true, {}, dropComponentsOption[0], { custom: { x: event.offsetX, y: event.offsetY } }));
	}
	dragend(event) {
		event.dataTransfer.clearData();
	}
	handleLeftMenuClick(vm, e, item) {
		if (!this.currentPlugins || !this.currentPlugins[0]) {
			this.$message.error('当前没有选中组件,请选中需要操作的组件在进行' + item.label);
			return false;
		}
		const eventCallback = {
			// 剪切
			eventCb1: () => {
				this.copyPluginCallback();
				this.delPluginCallback();
			},
			// 复制
			eventCb2: () => {
				this.copyPluginCallback();
			},
			// 粘贴
			eventCb3: () => {
				this.pastePluginCallback();
			},
			// 删除
			eventCb4: () => {
				this.delPluginCallback();
			}
		};

		eventCallback[`eventCb${item.id}`]();
	}
	showVruleLine(e) {
		this.auxLineY = {
			display: 'block',
			transform: `translateY(${e.clientY - 60}px)`
		};
	}
	hideVruleLine(e) {
		this.auxLineY = {
			display: 'none'
		};
	}
	showHruleLine(e) {
		this.auxLineX = {
			display: 'block',
			transform: `translateX(${e.clientX - 200}px)`
		};
	}
	hideHruleLine(e) {
		this.auxLineX = {
			display: 'none'
		};
	}
	createPageCanvas(h) {
		// TODO 没有考虑多页面,后期考虑
		return <div class="designer-content-ruler">
			<pageCanvas
				xw={page.style.w + 18}
				xh={18}
				yw={page.style.h + 18}
				yh={18}
				background={page.style.background}
				on-drop={($event) => this.drop($event)}
				on-dragover={($event) => this.dragover($event)}
				on-dragend={($event) => this.dragend($event)}
				on-showVruleLine={e => { this.showVruleLine(e); }}
				on-hideVruleLine={e => { this.hideVruleLine(e); }}
				on-showHruleLine={e => { this.showHruleLine(e); }}
				on-hideHruleLine={e => { this.hideHruleLine(e); }}>
				{this.createComponentsItem(h)}
			</pageCanvas>
		</div>;
	}
	createSetting(h) {
		return <div class="designer-content-setting">
			{this.currentPlugins[0] && page.style.layoutStyle === '1' && <ul class="designer-content-setting__ul">
				<li>
					<span>Y:</span>
					<span>{this.currentPlugins[0].custom.y}</span>
				</li>
				<li>
					<span>X:</span>
					<span>{this.currentPlugins[0].custom.x}</span>
				</li>
				<li>
					<span>高:</span>
					<span>{this.currentPlugins[0].custom.height}</span>
				</li>
				<li>
					<span>宽:</span>
					<span>{this.currentPlugins[0].custom.width}</span>
				</li>
			</ul>}
		</div>;
	}
	createAuxiliaryLineY(h) {
		return <div class="designer-content-aus-line__y" style={this.auxLineY}></div>;
	}
	createAuxiliaryLineX(h) {
		return <div class="designer-content-aus-line__x" style={this.auxLineX}></div>;
	}
	createComponentsItem(h) {
		const LayoutView = {
			1: (h) => <PageLayoutViewDefault onLeftMenuClick={(item) => this.handleLeftMenuClick(null, null, item)} />
		};

		if (LayoutView[page.style.layoutStyle]) return LayoutView[page.style.layoutStyle](h);

		return [];
	}
	mounted() {
		_this = this;
		this.bindEvent();
	}
	destroyed() {
		this.pageEvent && this.pageEvent.destroyedEvent();
	}
	render(h) {
		return <div class="designer-content" >
			{this.createPageCanvas(h)}
			{this.createSetting(h)}
			{this.createAuxiliaryLineX(h)}
			{this.createAuxiliaryLineY(h)}
		</div>;
	}
}

</script>

<style lang="scss">
.designer-content {
	width: 100%;
	height: 100%;
	position: relative;
	&-ruler {
		width: 100% !important;
		height: calc(100% - 30px);
		padding: 0 !important;
	}
	&-setting {
		height: 30px;
		line-height: 30px;
		border-top: 1px solid #c3c3c3;
		&__ul {
			flex-direction: row-reverse;
			display: flex;
			align-items: center;
			list-style: none;
			margin: 0;
			font-size: 12px;
			li {
				margin-right: 15px;
			}
		}
	}
	&-drag {
		&-proxy {
			border: 1px solid #000;
			background: #fff;
			overflow: auto;
			height: 100%;
			width: 100%;
			box-sizing: border-box;
			position: relative;
		}
	}
	&__container {
		width: calc(100% - 19px);
		height: calc(100% - 19px);
		position: relative;
		top: 19px;
		left: 19px;
	}
	&-aus-line {
		&__x {
			top: 0;
			left: 0;
			height: 100%;
			position: absolute;
			border-left: 1px solid red;
			transition: translateX 0.3s;
			display: none;
			z-index: 1;
		}
		&__y {
			top: 0;
			left: 0;
			width: 100%;
			position: absolute;
			border-top: 1px solid red;
			transition: translateY 0.3s;
			display: none;
			z-index: 1;
		}
	}
	.container-components {
		.handle-bm,
		.handle-bl,
		.handle-br {
			bottom: -30px !important;
		}
	}
	.drag-handle {
		background: #dedede;
		height: 20px;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		&:hover {
			cursor: move;
		}
		&--label {
			font-size: 12px;
			color: #424242;
		}
	}
}
</style>
