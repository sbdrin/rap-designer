<template>
	<div id="app"
		 class="ui-designer">
		<keep-alive :include="['home']">
			<router-view />
		</keep-alive>
	</div>
</template>
<script>
export default {
	name: 'app',

	mounted() {
		const pagePlugins = window.localStorage.getItem('pagePlugins');

		const plugins = JSON.parse(pagePlugins, (key, value) => {
			if (key === 'render') {
				// eslint-disable-next-line no-eval
				return eval('(function(){return ' + value + ' })()');
			}

			return value;
		});

		if (pagePlugins && plugins && plugins.length) {
			plugins.forEach(item => {
				if (item.custom && item.custom.eventListener) {
					const eventListenerKeys = Object.keys(item.custom.eventListener);
					if (eventListenerKeys.length) {
						eventListenerKeys.forEach(key => {
							// eslint-disable-next-line no-new-func
							item.custom.eventListener[key] = new Function(`return ${item.custom.eventListener[key]}`)();
						});
					}
				}

				this.$store.commit('addPlugin', item);
			});
		}
	}
};
</script>
<style>
body {
	margin: 0;
	padding: 0;
	/* overflow: hidden; */
}
#app {
	font-family: "Avenir", Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	/* text-align: center; */
	color: #2c3e50;
	/* margin-top: 60px; */
}
</style>
