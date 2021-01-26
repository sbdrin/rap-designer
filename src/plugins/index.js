import Vue from 'vue';


import xaAlert from './alert/alert.vue';
import alertConfig from './alert/alertConfig';

export const DEFAULT_CONFIG = [
	alertConfig
];


const plugins = {
	xaAlert
};

const installComponents = function () {
	Object.keys(plugins).map(item => {
		Vue.component(item, plugins[item]);
	});
};

export default installComponents;
