<template>
  <a :href="link" target="_blank" :title="title" class="mr-2">
    <div
      class="
        bg-white
        rounded-full
        brand-icon
        flex
        items-start
        justify-start
        ml-2
      "
    >
      <font-awesome-icon :icon="icon" class="icon" />
    </div>
  </a>
</template>

<script>
export default {
  props: {
    icon: {
      type: Array,
      required: true
    },
    link: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: () => 'Follow Us!'
    }
  }
}
</script>

<style lang="scss" scoped>
$size: 36px;
.brand-icon {
  width: $size;
  height: $size;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    color: white;
    background-color: #4285f4;
  }
}
.icon {
  font-size: $size - 14px;
  position: relative;
}
</style>
