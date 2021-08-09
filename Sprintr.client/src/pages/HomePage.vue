<template>
  <div class="Home row w-100 m-0 d-flex">
    <div class="col-md-8 p-0 m-5 border border-dark shadow drop-shadow">
      <div class="row w-100 m-0 p-5">
        <div class="col-md-8 p-3">
          <h4>Projects</h4>
          <h6>A list of all Projects for {{ state.account.email }}</h6>
        </div>
        <div class="col-md-2 p-0">
          <button class="btn btn-success" data-toggle="modal" data-target="#projectModal">
            <p>Create Project</p>
          </button>
        </div>
        <div class="col-md-12 p-0">
          <div class="row w-100 m-0 d-flex justify-content-between">
            <div class="col-md-3 p-1">
              <h6>Name</h6>
            </div>
            <div class="col-md-3 p-1">
              <h6>Members</h6>
            </div>
            <div class="col-md-3 p-1">
              <h6>Started</h6>
            </div>
          </div>
        </div>

        <div class="col-md-12 border-top border-dark">
          <ProjectThread :projects="state.projects" />
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div class="modal fade"
       id="projectModal"
       tabindex="-1"
       role="dialog"
       aria-labelledby="modelTitleId"
       aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Create New Project
          </h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="createProject">
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text"
                     v-model="state.createProject.name"
                     placeholder="Name..."
                     id="name"
                     name="name"
                     class="form-control"
              >
              <label for="description">Description</label>
              <textarea v-model="state.createProject.description"
                        placeholder="Description..."
                        class="form-control"
                        name="description"
                        id="description"
                        rows="3"
                        minlength="3"
                        required
              ></textarea>
            </div>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">
              Close
            </button>
            <button type="submit" class="btn btn-primary" data-dismiss="modal">
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from '@vue/reactivity'
import { computed } from '@vue/runtime-core'
import { AppState } from '../AppState'
import Pop from '../utils/Notifier'
import { projectsService } from '../services/ProjectsService'

export default {
  name: 'Home',
  setup() {
    const state = reactive({
      projects: computed(() => AppState.projects),
      account: computed(() => AppState.account),
      createProject: {}
    })

    return {
      state,
      async createProject() {
        try {
          state.createProject.creatorId = AppState.account.id
          const res = await projectsService.createProject(state.createProject)
          // NOTE TO DO LATER  router.push({ name: 'ProjectPage', params: { id: res.id } })
          state.createProject = {}
          Pop.toast(res.data, 'success')
        } catch (error) {
          Pop.toast('You done fucked up', 'error')
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.home{
  text-align: center;
  user-select: none;
  > img{
    height: 200px;
    width: 200px;
  }
}
</style>
