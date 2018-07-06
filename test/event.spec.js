import Event from '../src/utils/event'

describe('Event test', function() {
  it('可以on和emit事件', function() {
    const event = new Event()
    const cb = jasmine.createSpy()

    event.on('update', cb)
    event.emit('update', 123, 456)

    expect(cb).toHaveBeenCalledWith(123, 456)
  })

  it('同一个事件可以添加多个cb', function() {
    const event = new Event()
    const cb1 = jasmine.createSpy()
    const cb2 = jasmine.createSpy()

    event.on('update', cb1)
    event.on('update', cb2)
    event.emit('update', 123)

    expect(cb1).toHaveBeenCalledWith(123)
    expect(cb2).toHaveBeenCalledWith(123)
  })

  it('可以删除事件', function() {
    const event = new Event()
    const cb1 = jasmine.createSpy()
    const cb2 = jasmine.createSpy()

    event.on('update', cb1)
    event.on('update', cb2)
    event.off('update')
    event.emit('update', 123)

    expect(cb1).nothing(123)
    expect(cb2).nothing()
  })

  it('可以删除指定事件', function() {
    const event = new Event()
    const cb1 = jasmine.createSpy()
    const cb2 = jasmine.createSpy()

    event.on('update', cb1)
    event.on('update', cb2)
    event.off('update', cb2)
    event.emit('update', 123)

    expect(cb1).toHaveBeenCalledWith(123)
    expect(cb2).nothing()
  })
})
