import Lane from '../src/lane/index'
import Store from '../src/store/index'

describe('Lane test', function() {
  const code = '300216'
  const type = '1d'

  it('只能有一个Lane实例', function() {
    const lane1 = new Lane()
    const lane2 = new Lane()

    expect(lane1).toBe(lane2)
  })

  it('可以添加、获取Store', function() {
    const lane = new Lane()
    lane.clear()
    const store = new Store(code, type)

    lane.add(store)
    expect(lane.get(code, type)).toBe(store)
  })

  it('添加Store后有正确的数据结构', function() {
    const lane = new Lane()
    lane.clear()
    const store = new Store(code, type)

    lane.add(store)
    const stores = lane.stores
    expect(stores[code][type]).toBe(store)
  })

  it('不能添加重复code、type的Store', function() {
    const lane = new Lane()
    lane.clear()
    const store = new Store(code, type)

    lane.add(store)
    expect(() => lane.add(store)).toThrowError()
  })
})
