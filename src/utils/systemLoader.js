import Vue from 'vue';
import Observer from '@/utils/observer';
import installComponents from '@/plugins';
import Http from '@/utils/Http.module';
import KFront from 'kfront-baseui';
import ElementUI from 'element-ui';
import contentmenu from 'v-contextmenu';
import 'v-contextmenu/dist/index.css';
import '@/directive';
import '@/components';
import '@/styles/font.css';
import '@/styles/system.scss';
import '@/styles/ruler.css';
import '@/styles/element-variables.scss';
import '@/styles/custom.scss';

/**
 * 系统加载器
 */
export default class SystemLoader {
	mountGlobalVar() {
		window.Uidesigner || (window.Uidesigner = {});
		window.Uidesigner.$refs = {};
		window.Uidesigner.$event = new Observer();
	}
	mountComponents() {
		installComponents();
	}
	mountVue() {
		Vue.prototype.$http = new Http();
		Vue.use(KFront);
		Vue.use(ElementUI);
		Vue.use(contentmenu);
		Vue.config.productionTip = false;
	}
	bootstrap() {
		return new Promise(resolve => {
			this.mountGlobalVar();
			this.mountComponents();
			this.mountVue();
			resolve();
		});
	}
}
