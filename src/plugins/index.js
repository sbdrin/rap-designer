import Vue from 'vue';


import kaAlert from './alert/alert.vue';
import alertConfig from './alert/alert.config';

import kaButton from './button/button.vue';
import buttonConfig from './button/button.config';

import kaCheckBox from './checkBox/checkBox.vue';
import checkBoxConfig from './checkBox/checkBox.config';

import kaDatePicker from './datePicker/datePicker.vue';
import datePickerConfig from './datePicker/datePicker.config';

import kaContainerLayout from './containerLayout/containerLayout.vue';
import containerLayoutConfig from './containerLayout/containerLayout.config';

import kaInput from './input/input.vue';
import inputConfig from './input/input.config';

import kaInputNumber from './inputNumber/inputNumber.vue';
import inputNumberConfig from './inputNumber/inputNumber.config';

import kaRadio from './radio/radio.vue';
import radioConfig from './radio/radio.config';

import kaSelect from './select/select.vue';
import selectConfig from './select/select.config';

import kaSlider from './slider/slider.vue';
import sliderConfig from './slider/slider.config';

import kaTable from './table/table.vue';
import tableConfig from './table/table.config';

import kaTag from './tag/tag.vue';
import tagConfig from './tag/tag.config';

import kaTimePicker from './timePicker/timePicker.vue';
import timePickerConfig from './timePicker/timePicker.config';

import kaTree from './tree/tree.vue';
import treeConfig from './tree/tree.config';


export const DEFAULT_CONFIG = [
	containerLayoutConfig,
	buttonConfig,
	tagConfig,
	alertConfig,
	radioConfig,
	checkBoxConfig,
	inputConfig,
	inputNumberConfig,
	selectConfig,
	datePickerConfig,
	timePickerConfig,
	sliderConfig,
	tableConfig,
	treeConfig
];


const plugins = {
	kaAlert,
	kaButton,
	kaCheckBox,
	kaContainerLayout,
	kaDatePicker,
	kaInput,
	kaInputNumber,
	kaRadio,
	kaSelect,
	kaSlider,
	kaTable,
	kaTag,
	kaTimePicker,
	kaTree
};

const installComponents = function () {
	Object.keys(plugins).map(item => {
		Vue.component(item, plugins[item]);
	});
};

export default installComponents;
