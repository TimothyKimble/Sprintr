<template>
  <div class="ProjectSprintsPage row w-100 m-0 d-flex justify-content-center">
    <div class="col-md-12 p-0 m-5 border border-dark shadow drop-shadow">
      <div class="row w-100 m-0 p-5">
        <div class="col-md-8 p-3">
          <h4>{{ sprint.name }}</h4>
          <p><b>{{ sprint.startDate + ' - ' + sprint.endDate }} </b></p>
          <h6>Group your tasks into items for over-arching collections for better organization </h6>
          <div class="form-check">
            <label class="form-check-label">
              <input v-model="state.sprint.isOpen"
                     type="checkbox"
                     class="form-check-input"
                     name="isOpen"
                     id="isOpen"
              >
              Is this Sprint Open
            </label>
          </div>
        </div>
        <!-- <div class="col-md-4 p-0 d-flex justify-content-center align-items-center">
          <button class="btn btn-success roundedButton" data-toggle="modal" data-target="#backlogItemModal">
            <p class="m-0 p-0">
              +
            </p>
          </button>
        </div> -->
        <div class="col-md-12 border-top border-dark">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { AppState } from '../AppState'
import { sprintsService } from '../services/SprintsService'
import Pop from '../utils/Notifier'
import { logger } from '../utils/Logger'

export default {
  name: 'ProjectSprintPage',

  setup() {
    const route = useRoute()
    let tasks = ref([AppState.tasks])
    logger.log('Route keys', Object.keys(route.params))
    logger.log('router id', route.params.sprintId)
    logger.log('Sprints in AppState', AppState.sprints)
    onMounted(async() => {
      try {
        await sprintsService.getAllTasksIn(route.params.sprintId)
        tasks = AppState.tasks
        // logger.log('sprints in appstate Page,', AppState.sprints)
      } catch (error) {
        Pop.toast(error, 'error')
      }
    })
    return {
      tasks,
      route,
      sprint: computed(() => AppState.sprints.find(s => s.id === route.params.sprintId + ''))
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
