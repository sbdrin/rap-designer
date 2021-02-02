<template>
	<div class="ka-container-layout"
		 :style="styles">
		<slot />
	</div>
</template>

<script>
import pluginsMixins from '../pluginsMixins';
export default {
	name: 'kaContainerLayout',

	mixins: [pluginsMixins],
	data() {
		return {
			layout: []
		};
	},

	props: {
		options: Object,
		children: Array
	},

	watch: {
		children: {
			handler(newValue = [], oldValue = []) {
				const newIds = new Set(newValue.map(item => item.id));
				const oldIds = new Set(oldValue.map(item => item.id));

				const isAdd = new Set([...oldIds].filter(item => newIds.has(item))).size < newIds.size;
				const isDel = new Set([...newIds].filter(item => oldIds.has(item))).size < oldIds.size;

				if (isAdd || isDel || (oldIds.size === 0 && newIds.size === 1)) {
					this.createLayout(isDel);
				}
			},
			immediate: true
		}
	},

	methods: {
		createLayout(isDel) {
			const layout = [];
			if (isDel) {
				const newData = new Set(this.children.map(item => item.id));
				const oldData = new Set(this.layout.map(item => item.i));

				const diff = new Set([...oldData].filter(item => !newData.has(item)));

				this.layout.forEach(item => {
					if (!~[...diff].indexOf(item.i)) {
						layout.push(item);
					}
				});
				this.layout = layout.slice();

				return false;
			}


			this.children.map((item, index) => {
				if (!~this.layout.map(item => item.i).indexOf(item.id)) {
					layout.push({
						x: index * 2,
						y: 0,
						w: 12,
						h: 2,
						i: item.id,
						component: item.key,
						options: item.props,
						custom: item.custom
					});
				}
			});

			this.layout = [...this.layout, ...layout];
		},
		resizedEvent(i, newH, newW, newHPx, newWPx) {
			if (~i.indexOf('chart')) {
				const resizeItem = this.layout.find(item => item.i === i);

				let [j, len, currentIndex] = [0, this.layout.length, -1];

				for (; j < len; j++) {
					if (this.layout[j].i === i) {
						currentIndex = j;
						break;
					}
				}

				currentIndex >= 0 && this.$set(this.layout[currentIndex], 'custom', { width: newWPx, height: newHPx });
			}
		}
	}

};
</script>

<style lang="scss">
.ka-container-layout {
	position: relative;
	overflow: hidden;
}
</style>
