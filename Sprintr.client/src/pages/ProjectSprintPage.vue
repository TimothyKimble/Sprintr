<template>
  <div class="ProjectSprintPage row">
    <div class="col-md-12">
      <h2>This is our Sprint</h2>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
export default {
  name: 'ProjectSprintPage',
  setup() {
    const state = reactive({
      name: 'hi'
    })
    return { state }
  }
}
</script>

<style lang="scss" scoped>

</style>
