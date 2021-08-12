<template>
  <div class="ProjectBacklogPage row w-100 m-0 d-flex justify-content-center">
    <div class="col-md-12">
      <div class="row bg-dark text-light">
        <div class="col-md-3">
          <button type="button" class="btn btn-primary" @click="destroyProject">
            - Project
          </button>
          <router-link :to="{name: 'ProjectBacklog', params: {id: router.params.id}}">
            Backlog
          </router-link>
        </div>
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#createSprint">
          +
        </button>
        <div v-for="s in sprintsIn" :key="s" class="col-md-3">
          <router-link :to="{name: 'ProjectSprint', params: {id: router.params.id, sprintId: s.id}}">
            {{ s.name }}
          </router-link>
        </div>
      </div>
      <router-view />
    </div>
  </div>

  <!-- Modal -->
  <div class="modal fade"
       id="createSprint"
       tabindex="-1"
       role="dialog"
       aria-labelledby="modelTitleId"
       aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Create New Sprint Item
          </h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="createSprint">
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text"
                     v-model="state.createSprint.name"
                     placeholder="Name..."
                     id="name"
                     name="name"
                     class="form-control"
              >
              <div class="form-group">
                <label for="startDate">Start Date:</label>
                <input v-model="state.createSprint.startDate" type="date" class="form-control" name="startDate" id="startDate">
              </div>
              <div class="form-group">
                <label for="endDate">End Date:</label>
                <input v-model="state.createSprint.endDate" type="date" class="form-control" name="endDate" id="endDate">
              </div>

              <div class="form-check">
                <label class="form-check-label">
                  <input v-model="state.createSprint.isOpen"
                         type="checkbox"
                         class="form-check-input"
                         name="isOpen"
                         id="isOpen"
                         value="checkedValue"
                  >
                  Check if Not Done
                </label>
              </div>
            </div>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">
              Close
            </button>
            <button type="submit" class="btn btn-primary">
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { computed, onMounted, reactive } from '@vue/runtime-core'
import { useRoute, useRouter } from 'vue-router'
import { projectsService } from '../services/ProjectsService'
import { backlogItemsService } from '../services/BacklogItemsService'
import { logger } from '../utils/Logger'
import Pop from '../utils/Notifier'
import { AppState } from '../AppState'
import { sprintsService } from '../services/SprintsService'

export default {
  name: 'ProjectBacklogPage',
  router: useRoute(),
  route: useRouter(),
  setup() {
    // $('#show').click(function() {
    //   $('#backlogItemsModal').modal('show')
    // })
    const route = useRouter()
    const router = useRoute()
    // logger.log('router id:', router.params.id)
    // logger.log('router keys:', Object.keys(router.params))
    const state = reactive({
      backlogItems: computed(() => AppState.backlogItems),
      createSprint: {}
    })
    onMounted(async() => {
      const router = useRoute()
      try {
        const res = await projectsService.getAllSprintsIn(router.params.id)
        await projectsService.getAllBacklogItemsIn(router.params.id)
        // logger.log('This is the sprint responce,', res)
        // logger.log('Apstate Sprints:', AppState.sprints)
      } catch (error) {
        Pop.toast('Error Get Sprint in Poject Item', 'error')
      }
    })
    return {
      state,
      router,
      route,
      async createSprint() {
        try {
          state.createSprint.creatorId = AppState.account.id
          state.createSprint.projectId = router.params.id
          const res = await sprintsService.createSprint(state.createSprint)
          // logger.log(res)
          $('#createSprint').modal('hide')
          state.createSprint = {}
          Pop.toast('You Made A Sprint!', 'success')
        } catch (error) {
          Pop.toast(error, 'error')
        }
      },
      async destroyProject() {
        try {
          if (await Pop.confirm()) {
            // logger.log(AppState.user.id)
            await projectsService.destroyProject(router.params.id)
            route.push({ name: 'Home' })
          }
        } catch (error) {
          Pop.toast(error, 'error')
        }
      },
      sprintsIn: computed(() => AppState.sprints)
    }
  }
}
</script>

  <style scoped lang="scss">
    .projectBacklogPage{
    text-align: center;
    user-select: none;
    > img{
    height: 200px;
    width: 200px;
    }
    }

    .roundedButton {
    border-radius: 50%;
    }

    .exampleBack {
    background-color: red($color: #df1d1d);
    }

    .fa-weight-hanging {
    color: #6c1890
    }
    .weight-text {
    color: #6c1890
    }
  </style>
