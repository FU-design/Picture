// class PromisePool {
//   private queue: (() => Promise<void>)[] = []
//   private maxConcurrent: number
//   private running: number = 0

//   constructor(maxConcurrent: number) {
//     this.maxConcurrent = maxConcurrent
//   }

//   addTask(task: () => Promise<void>) {
//     this.queue.push(task)
//     this.schedule()
//   }

//   private schedule(): void {
//     while ((this.running < this.maxConcurrent) && this.queue.length > 0) {
//       const task = this.queue.shift()
//       if (task) {
//         this.running++
//         task().finally(() => {
//           this.running--
//           this.schedule()
//         })
//       }
//     }
//   }
// }

// 转化为方法
async function asyncPool<T, R>(
  poolLimit: number,
  timeArray: T[],
  handler: (task: T) => Promise<R>,
): Promise<R[]> {
  let i = 0 // 任务索引
  const results: Promise<R>[] = [] // 存储所有任务的 Promise
  const executing: Promise<void>[] = [] // 存储正在执行的任务的 Promise

  // 递归调度任务
  const enqueue = (): Promise<void> => {
    if (i === timeArray.length) {
      return Promise.resolve() // 所有任务已入队
    }

    const task = timeArray[i++] // 取出当前任务
    const taskPromise = Promise.resolve().then(() => handler(task)) // 包装任务为 Promise
    results.push(taskPromise) // 保存任务的 Promise

    // 任务完成后从 executing 中移除自身
    const cleanupPromise = taskPromise.then(() => {
      // eslint-disable-next-line ts/no-use-before-define
      executing.splice(executing.indexOf(executingPromise), 1)
    })
    const executingPromise = cleanupPromise
    executing.push(executingPromise)

    // 动态控制并发：如果当前并发数达到上限，等待任意一个任务完成
    let racePromise: Promise<void> = Promise.resolve()
    if (executing.length >= poolLimit) {
      racePromise = Promise.race(executing)
    }

    // 递归调度下一个任务
    return racePromise.then(() => enqueue())
  }

  // 启动调度，最终返回所有任务的结果
  await enqueue()
  return await Promise.all(results)
}
function httpRequest(sleep: number): Promise<number> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(sleep)
    }, sleep)
  })
}

// const promisePool = new PromisePool(2)

// for (let i = 1; i < 7; i++) {
//     promisePool.addTask(async () => {
//         console.log(i, 'start')
//         await httpRequest((Math.floor(Math.random() * 6) + 1) * 1000)
//         console.log(i, 'complate')
//     })
// }

// 2. 定义任务参数数组
const delays = [1000, 2000, 3000, 1500, 500]

// 3. 执行并发控制
asyncPool<number, number>(
  2,
  delays,
  async (delay) => {
    console.warn(`任务 ${delay}ms 开始`)
    const result = await httpRequest(delay)
    console.warn(`任务 ${delay}ms 完成`)
    return result
  },
).then((results) => {
  console.warn('所有结果:', results)
})
