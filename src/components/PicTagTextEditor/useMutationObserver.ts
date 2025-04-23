import { reactive, type Ref, shallowRef } from 'vue'

type RequireAtLeastOne<
  T,
  Keys extends keyof T = keyof T,
> = Partial<T> & {
  [K in Keys]: Required<Pick<T, K>>
}[Keys]

export type Callback = (mutations: MutationRecord, observer?: MutationObserver) => void
export type MutationCallbackMap = RequireAtLeastOne<Record<MutationRecordType, Callback>>

export function useMutationObserver(observerElementRef: Ref<HTMLElement | undefined>, mutationCallbackMap: MutationCallbackMap, options?: MutationObserverInit) {
  const observer = shallowRef<MutationObserver>()
  const observerOptions = reactive<MutationObserverInit>({
    childList: false, // 监听 target 节点中发生的节点的新增与删除（同时，如果 subtree 为 true，会针对整个子树生效
    characterData: false, // 监听声明的 target 节点上所有字符的变化
    subtree: true, // 监听以 target 为根节点的整个子树
  })

  const handleObserver = (mutations: MutationRecord[], observer: MutationObserver) => {
    mutations.forEach((mutation) => {
      mutationCallbackMap[mutation.type]?.(mutation, observer)
    })
  }

  const setupObserver = () => {
    // merge options
    for (const key of Object.keys(mutationCallbackMap) as MutationRecordType[]) {
      observerOptions[key] = !!mutationCallbackMap[key]
    }
    // merge options
    if (options) {
      Object.assign(observerOptions, options)
    }
    observer.value = observer.value ?? new MutationObserver(handleObserver)
    observer.value?.observe(observerElementRef.value!, observerOptions)
  }

  return {
    observer,
    setupObserver,
  }
}
