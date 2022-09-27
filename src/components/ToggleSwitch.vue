<template>
    <label class="switch">
        <input type="checkbox" v-model="value" @change="updateValue" />
        <span class="slider"></span>
    </label>
</template>

<script>

export default {
    name: 'ToggleSwitch',
    props: ['default'],
    data() {
        return {
            value: this.default,
        }
    },
    methods: {
        updateValue() {
            this.$emit('switchFlipped', this.value)
        },
    },
}

</script>

<style scoped>

.switch {
    transform: translateY(-6px);
    position: relative;
    display: inline-block;
    width: 100px;
    height: 34px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: 34px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color: #2196F3;
}

input:focus + .slider {
    box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(66px);
  -ms-transform: translateX(66px);
  transform: translateX(66px);
}

</style>
