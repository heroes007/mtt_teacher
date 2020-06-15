export default {
  state: {
   hounerState: false,
   taskState: false
  },
  mutations: {
    set_houner_state(state,param){
        state.hounerState = param
    },
    get_task_state(state, param){
      state.taskState = param
    }
  }
};

