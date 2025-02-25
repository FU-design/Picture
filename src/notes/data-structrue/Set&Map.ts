/**
 * 数组去重
 */

{
  const arr = [1, 2, 2, 3, Number.NaN, Number.NaN, undefined, function () {}, () => {}, null, null, undefined, 0, -0]
  const uniqueArr = [...new Set(arr)] // [1, 2, 3, NaN]
  console.warn('uniqueArr :>> ', uniqueArr)
  // [
  //   1,
  //   2,
  //   3,
  //   NaN,
  //   undefined,
  //   [Function (anonymous)],
  //   [Function (anonymous)],
  //   null,
  //   0
  // ]

  // 对象数组去重（需结合唯一标识）
  const users = [
    { id: 1, name: 'Alice' },
    { id: 1, name: 'test' },
    { id: 2, name: 'Bob' },
  ]

  // 利用 Map 键值的唯一性，但最终筛选后重复的键的值为最后一个找到的重复对象
  const map = new Map(users.map(v => [v.id, v]))
  console.warn(Array.from(map.values())) // [ { id: 1, name: 'test' }, { id: 2, name: 'Bob' } ]

  // 自实现 filter + Set
  // const userIds = new Set()
  // const filterUsers = users.filter(user => !userIds.has(user.id) && userIds.add(user.id))

  // 闭包 + 状态保持
  const filterUsers = users.filter(
    (memory => user => !memory[user.id] && (memory[user.id] = true))({} as any,
    ),
  )
  console.warn(filterUsers) // [ { id: 1, name: 'Alice' }, { id: 2, name: 'Bob' } ]
}

/**
 * 集合运算
 */

{
  const userA = [
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
    { id: 2, name: 'D' },
    { id: 1, name: 'C' },
  ]
  const userB = [
    { id: 1, name: 'C' },
    { id: 4, name: 'B' },
    { id: 6, name: 'E' },
  ]

  // 并集并根据name去重
  const nameSet = new Set()
  const unionByName = [...userA, ...userB].filter(user => !nameSet.has(user.name) && nameSet.add(user.name))
  console.warn(unionByName)

  // 并集并根据 name 和 id 去重
  const data = [...userA, ...userB]
  // forEach + Map
  const mapUser = new Map()
  data.forEach((user) => {
    if (!mapUser.get(user.name) || mapUser.get(user.name).id < user.id) {
      mapUser.set(user.name, user)
    }
  })
  console.warn(Array.from(mapUser.values()))

  // reduce + Map
  const result = Array.from(data.reduce((pre, value) => {
    if (!pre.get(value.name) || pre.get(value.name).id < value.id) {
      pre.set(value.name, value)
    }
    return pre
  }, new Map()).values())
  console.warn(result)

  // 交集
  const userBMap = new Map(userB.map(user => [`${user.name}-${user.id}`, user]))
  // 筛选 userA 中与 userB 有相同 name 和 id 的项
  const intersection = userA.filter(userAItem => userBMap.has(`${userAItem.name}-${userAItem.id}`))
  console.warn(intersection)
  debugger
}

debugger
