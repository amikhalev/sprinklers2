import later from 'later';

later.date.localTime();

export function parseSchedule(scheduleString) {
  return new Promise((resolve, reject) => {
    let sched = later.parse.text(scheduleString);
    if (sched.error !== -1) {
      let errorText = 'Error in schedule text: \n' +
        scheduleString + '\n' +
        new Array(sched.error + 1).join('-') + '^';
      reject(new Error(errorText));
    } else {
      resolve(sched);
    }
  });
}

export function startSchedule(schedule, func) {
  let {clear} = later.setInterval(func, schedule);
  return {
    stop: clear
  };
}