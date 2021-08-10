<template>
  <div class="project row w-100 m-0 d-flex justify-content-center">
    <!-- Load BackLoadItems -->
    <div class="col-md-12 p-0 m-5 border border-dark shadow drop-shadow">
      <div class="row w-100 m-0 p-5">
        <div class="col-md-8 p-3">
          <h4>Backlog Items</h4>
          <h6>Group your tasks into items for over-arching collections for better organization </h6>
        </div>
        <div class="col-md-4 p-0 d-flex justify-content-center align-items-center">
          <button class="btn btn-success roundedButton" data-toggle="modal" data-target="#projectModal">
            <p class="m-0 p-0">
              +
            </p>
          </button>
        </div>
        <div class="col-md-12 border-top border-dark">
          <BacklogItemThread :projects="state.projects" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, reactive } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
import { projectsService } from '../services/ProjectsService'
import { logger } from '../utils/Logger'
import Pop from '../utils/Notifier'
import { AppState } from '../AppState'

export default {
  router: useRoute(),
  name: 'ProjectPage',
  setup() {
    const state = reactive({
      project: computed(() => AppState.projects[0])
    })
    onMounted(async() => {
      const router = useRoute()
      try {
        await projectsService.getAllBacklogItemsIn({ id: router.params.id })
      } catch (error) {
        Pop.toast('Error Get Backlog Item', 'error')
      }
    })
    return {
      state
    }
  }
}
</script>
