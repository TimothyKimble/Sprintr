<template>
  <div class="ProjectThread">
    <ProjectCard v-for="p in projects" :key="p.id" :project="p" />
  </div>
</template>

<script>
export default {
  name: 'ProjectThread',
  props: {
    projects: { type: Array, required: true }
  },
  setup() {
    return {}
  }
}
</script>

<style lang="scss" scoped>

</style>
