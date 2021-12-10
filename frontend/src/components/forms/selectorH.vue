<template>
  <div :class="customWrapperStyle()">
    <div
      v-for="opt in options"
      :key="getKey(opt)"
      class="
        px-2
        py-2
        font-semibold
        text-center
        whitespace-no-wrap
        text-13
        cursor-pointer
      "
      :class="styles(opt)"
      @click="select(opt)"
    >
      {{ getText(opt) }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectorHorizantal',
  props: {
    options: {
      type: Array,
      required: true
    },
    value: {
      type: Array,
      required: true
    },
    customClass: {
      type: Object,
      default: () => null
    },
    customStyle: {
      type: String,
      default: null
    },
    single: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      selected: this.value
    }
  },
  watch: {
    selected() {
      this.updateValue()
    }
  },
  methods: {
    getKey(value) {
      return typeof value === 'object' && '_id' in value ? value._id : value
    },
    getText(value) {
      return typeof value === 'object' && 'title' in value ? value.title : value
    },
    updateValue() {
      this.$emit('input', this.selected)
    },
    select(value) {
      if (this.single) {
        this.selected = [value]
      } else {
        if (!this.selected.includes(value)) {
          this.selected.push(value)
        } else {
          this.selected = this.selected.filter((v) => v != value)
        }
      }
    },
    styles(opt) {
      const compare = (c) => {
        if (typeof c === 'object' && '_id' in c) {
          return c._id === opt._id
        } else if (typeof c === 'object' && 'title' in c) {
          return c.title === opt.title
        } else {
          return c === opt
        }
      }
      return {
        'bg-primary-accentLight': this.selected.some(compare),
        'bg-primary-accentLighter': !this.selected.some(compare),
        ...this.customClass
      }
    },
    customWrapperStyle() {
      if (!this.customStyle) return 'grid grid-cols-3 gap-3'
      return this.customStyle
    }
  }
}
</script>
