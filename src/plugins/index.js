import Vue from 'vue';


import kaAlert from './alert/alert.vue';
import alertConfig from './alert/alert.config';

import kaContainerLayout from './containerLayout/containerLayout.vue';
import containerLayoutConfig from './containerLayout/containerLayout.config';

export const DEFAULT_CONFIG = [
	alertConfig,
	containerLayoutConfig
];


const plugins = {
	kaAlert,
	kaContainerLayout
};

const installComponents = function () {
	Object.keys(plugins).map(item => {
		Vue.component(item, plugins[item]);
	});
};

export default installComponents;
