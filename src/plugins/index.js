import Vue from 'vue';


import xaAlert from './alert/alert.vue';


const plugins = {
	xaAlert
};

const installComponents = function () {
	Object.keys(plugins).map(item => {
		Vue.component(item, plugins[item]);
	});
};

export default installComponents;
