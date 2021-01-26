import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import store from './store';

Vue.config.productionTip = false;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const SystemLoader: any = require('./utils/systemLoader').default;
new SystemLoader().bootstrap().then(() => {
	new Vue({
		router,
		store,
		render: h => h(App)
	}).$mount('#app');
});
