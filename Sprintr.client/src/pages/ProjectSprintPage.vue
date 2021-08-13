<template>
  <div class="ProjectSprintsPage row w-100 m-0 d-flex justify-content-center">
    <div class="col-md-12 p-0 m-5 border border-dark shadow drop-shadow">
      <div class="row w-100 m-0 p-5">
        <div class="col-md-8 p-3">
          <div class="d-flex justify-content-between">
            <h4>{{ sprint.name }}</h4>
            <button type="button" class="btn btn-outline-danger" @Click="removeSprint">
              - Sprint
            </button>
          </div>
          <div class="col-md-2 p-0 d-flex justify-content-around align-items-center">
            <h5 class="weight-text p-0">
              {{ totalWeight }}
            </h5>
            <i class="fas fa-weight-hanging fa-2x"></i>
          </div>
          <p><b>{{ dateFormatter(sprint.startDate) + ' - ' + dateFormatter(sprint.endDate) }} </b></p>
          <h6>Group your tasks into items for over-arching collections for better organization </h6>
          <div class="form-check">
            <label class="form-check-label">
              <input v-model="sprint.isOpen"
                     type="checkbox"
                     class="form-check-input"
                     name="isOpen"
                     id="isOpen"
              >
              Is this Sprint Open
            </label>
          </div>
          <div class="row m-0 w-100">
            <div class="col-md-12 p-0">
              <TaskCard v-for="t in tasks" :key="t.id" :task="t" />
            </div>
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
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AppState } from '../AppState'
import { sprintsService } from '../services/SprintsService'
import Pop from '../utils/Notifier'
// import { logger } from '../utils/Logger'
import { dateFormatter } from '../utils/DateFormat'
import { projectsService } from '../services/ProjectsService'

export default {
  name: 'ProjectSprintPage',
  setup() {
    const route = useRoute()
    const router = useRouter()
    onMounted(async() => {
      try {
        // logger.log('Sprint to get task id:', route.params.sprintId)
        await sprintsService.getAllTasksIn(route.params.sprintId)
        // logger.log('Tasks in appstate Page,', AppState.tasks)
      } catch (error) {
        Pop.toast(error, 'error')
      }
    })
    return {
      dateFormatter,
      route,
      router,
      sprint: computed(() => AppState.sprints.find(s => s.id === route.params.sprintId)),
      //   logger.log('id', s.id)
      //   logger.log('sprintId', route.params.sprintId)
      //   if () {
      //     return s
      //   } else return false
      // })

      async removeSprint() {
        try {
          if (await Pop.confirm()) {
            await sprintsService.removeSprint(route.params.sprintId)
            Pop.toast('Deleted Sprint', 'success')
            router.push({ name: 'ProjectBacklog', params: { id: route.params.sprintId } })
            projectsService.getAllSprintsIn(route.params.id)
          }
        } catch (error) {
          Pop.toast(error, 'error')
        }
      },
      tasks: computed(() => [...AppState.tasks]),
      totalWeight: computed(() => {
        let summer = 0
        const task = [...AppState.tasks]
        task.forEach(t => (summer += parseInt(t.weight)))
        return summer
      })
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
