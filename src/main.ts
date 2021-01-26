import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store'

Vue.config.productionTip = false
let SystemLoader:any = require('./utils/systemLoader')
new SystemLoader.default().bootstrap().then(() => {
	new Vue({
		router,
		store,
		render: h => h(App)
	}).$mount('#app');
});
