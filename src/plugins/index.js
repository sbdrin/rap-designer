import Vue from 'vue';


import kaAlert from './alert/alert.vue';
import alertConfig from './alert/alertConfig';

export const DEFAULT_CONFIG = [
	alertConfig
];


const plugins = {
	kaAlert
};

const installComponents = function () {
	Object.keys(plugins).map(item => {
		Vue.component(item, plugins[item]);
	});
};

export default installComponents;
