<template>
  <div class="project">
    <div class="row m-0 d-flex p-3 w-100 justify-content-between border-bottom border-dark my-4 align-items-center CardShadowing shrink">
      <router-link class="col-md-3 p-0"
                   :to="{name:
                           'ProjectBacklog',
                         params:
                           {id:
                             project.id}
                   }"
      >
        <div class="p-1">
          <p>{{ project.name }}</p>
        </div>
      </router-link>
      <div class="col-md-3 p-1">
        <img class="rounded-pill w-15" :src="project.creator.picture" alt="">
      </div>
      <div class="col-md-3 p-1">
        <div class="row w-100 m-0 d-flex justify-content-end h-100">
          <div class="col-md-11 p-0">
            <p>{{ state.createdAt.toLocaleString('en-US', 'short') }}</p>
          </div>
          <div class="col-md-1 col-3 p-0 d-flex align-items-end justify-content-center">
            <button @click="destroyProject" class="btn btn-danger w-100 roundedButton d-flex justify-content-center ">
              -
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from '@vue/reactivity'
// import { logger } from '../utils/Logger'
import Pop from '../utils/Notifier'
import { projectsService } from '../services/ProjectsService'
// import { AppState } from '../AppState'

export default {
  name: 'Project',
  props: {
    project: { type: Object, required: true }
  },
  setup(props) {
    // logger.log('project id:', props.project.id)
    const state = reactive({
      createdAt: new Date(props.project.createdAt)
    })
    return {
      state,
      async destroyProject() {
        try {
          if (await Pop.confirm()) {
            // logger.log(AppState.user.id)
            await projectsService.destroyProject(props.project.id)
          }
        } catch (error) {
          Pop.toast(error, 'error')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.w-15 {
  width: 15%;
}
.roundedButton {
  border-radius: 50%;
}
.CardShadowing {
  box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 20px, rgba(0, 0, 0, 0.22) 0px 5px 5px;
}
.shrink {
transition: all .3s ease-in-out;
}
.shrink:hover {
transform: scale(0.99);
}
</style>
