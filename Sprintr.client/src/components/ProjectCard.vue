<template>
  <div class="project">
    <div class="row m-0 d-flex mt-1 w-100 justify-content-between">
      <div class="col-md-3 p-1">
        <p>{{ project.name }}</p>
      </div>
      <div class="col-md-3 p-1">
        <img class="rounded-pill w-50" :src="project.creator.picture" alt="">
      </div>
      <div class="col-md-3 p-1">
        <p>{{ state.createdAt.toLocaleString('en-US', 'short') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from '@vue/reactivity'
import { logger } from '../utils/Logger'

export default {
  name: 'Project',
  props: {
    project: { type: Object, required: true }
  },
  setup(props) {
    const state = reactive({
      createdAt: new Date(props.project.createdAt)
    })
    return { state }
  },
  components: {}
}
</script>

<style lang="scss" scoped>

</style>
