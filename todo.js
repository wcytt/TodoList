/*
* 1、基本 html 结构
* 2、绑定添加按钮事件，把数据存储在 localStorage 中
* 3、绑定完成和删除按钮的事件，并更新数据
* 4、实现翻页功能，一页存储 10 条信息
* */

// log 函数，定位 bug
var log = console.log.bind(console, '### bug =>')

// e 函数，选择 dom
var e = function(className) {
    return document.querySelector(className)
}

// toggleClass 函数，开关函数
var toggleClass = function(element, className) {
    if(element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }
}

// removeClassAll 函数，删除所有的 class
var removeClassAll = function(className) {
    var selector = '.' + className
    var elements = document.querySelectorAll(className)
    for(var i = 0; i < elements.length; i++) {
        var obj = elements[i]
        obj.classList.remove(className)
    }
}

var appendHtml = function(element, html) {
    element.insertAdjacentHTML('beforeend', html)
}

var bindEvent = function(element, eventName, callback) {
    element.addEventListener(eventName, callback)
}

var bindAll = function(selector, eventName, callback) {
    var elements = document.querySelectorAll(selector)
    for(var i = 0; i < elements.length; i++) {
        var e = elements[i]
        bindEvent(e, eventName, callback)
    }
}

var removeAll = function(sel) {
    var tags = document.querySelectorAll(sel)
    for (var i = 0; i < tags.length; i++) {
        var tag = tags[i]
        tag.remove()
    }
}

// 使用模板字符串生成 html 并返回
var templateTodo = function(id, done, todo) {
    //
    var status = ''
    // 根据参数来确定生成的模板
    var describe = '未完成'
    if(done) {
        describe = '完成'
        status = 'done'
    }
    // 使用模板字符串
    var html = `
        <div class="section-container-todo ${status}" data-todo=${id}>
                    <div class="section-content">${todo}</div>
                    <div class="section-state">${describe}</div>
                    <div class="section-button">
                        <button class="button-done">完成</button>
                        <button class="button-delete">删除</button>
                    </div>
                </div>
    `
    return html
}

// 添加到页面上
var innerTodo = function(id, done, content) {
    var html = templateTodo(id, done, content)
    var container = e('.section-container')
    container.innerHTML += html
}

// 载入页面的时候把 localStorage.todoApp 的值添加到页面
var loadTodos = function() {
    // 判断是否有值
    if(localStorage.todoApp === JSON.stringify([]) || localStorage.todoApp === undefined) {
        localStorage.todoApp = JSON.stringify([])
    }
    // 取值
    var todos = JSON.parse(localStorage.todoApp)
    // log('todos', todos)
    // 显示第几页的
    // 获取页码
    var page = parseInt(e('.page-number').innerHTML)
    // 开始、结束的下标
    var start = (page - 1) * 10
    var end = start + 9
    if(end > todos.length) {
        end = todos.length - 1
    }
    // log('开始 结束', start, end)
    // 循环添加到页面上
    for(var i = start; i <= end; i++) {
        var todo = todos[i]
        innerTodo(todo.id, todo.done, todo.content)
    }
}

// 弹窗函数
var alertOne = function(message) {
    // html
    var t = `
        <div class="alert-main-one">
        <div class="alert-bg"></div>
        <div class="alert-container">
            <div class="alert-title">提示信息</div>
            <div class="alert-message">${message}</div>
            <div class="alert-control">
                <button class="alert-button" type="button" data-type="ok">确定</button>
            </div>
        </div>
        </div>
    `
    // 插入页面
    var body = e('body')
    appendHtml(body, t)
    // 绑定按钮事件
    var main = e('.alert-main-one')
    // log('alertone', main)
    main.querySelector('.alert-button').addEventListener('click', function(event) {
        main.remove()
    })
}

// 处理弹窗按钮的事件
var bindAlertTwoDone = function(div) {
    var element = e('.alert-main-two')
    element.addEventListener('click', function(event) {
        var self = event.target
        if(self.classList.contains('alert-button-two')) {
            var type = self.dataset.type
            if(type === 'ok') {
                // log('点击到了确定', type)
                // 点击到了确定，改变状态、更新到 localStorage.todoApp 中
                // 改变状态
                toggleClass(div, 'done')
                var state = div.querySelector('.section-state').innerHTML
                if(state === '完成') {
                    div.querySelector('.section-state').innerHTML = '未完成'
                } else {
                    div.querySelector('.section-state').innerHTML = '完成'
                }
                // 更新到 localStorage.todoApp 中
                var todoId = parseInt(div.dataset.todo)
                var todos = JSON.parse(localStorage.todoApp)
                for(var i = 0; i < todos.length; i++) {
                    var obj = todos[i].id
                    if(obj === todoId) {
                        if(todos[i].done === true) {
                            todos[i].done = false
                        } else {
                            todos[i].done = true
                        }
                        break
                    }
                }
                localStorage.todoApp = JSON.stringify(todos)
                // 隐藏弹窗
                var alert = e('.alert-main-two')
                alert.remove()
            } else {
                // 取消
                // 隐藏弹窗
                var alert = e('.alert-main-two')
                alert.remove()
            }
        }
    })
}

var bindAlertTwoDelete = function(div) {
    var element = e('.alert-main-two')
    element.addEventListener('click', function(event) {
        var self = event.target
        if(self.classList.contains('alert-button-two')) {
            var type = self.dataset.type
            if(type === 'ok') {
                // 得到 id 方便更新
                var todoId = parseInt(div.dataset.todo)
                // 删除
                div.remove()
                // 更新到 localStorage.todoApp 中
                var todos = JSON.parse(localStorage.todoApp)
                for(var i = 0; i < todos.length; i++) {
                    var obj = todos[i]
                    if(obj.id === todoId) {
                        todos.splice(i, 1)
                        break
                    }
                }
                // 保存
                localStorage.todoApp = JSON.stringify(todos)
                // 删除之后需要重新 load 数据
                // 清空
                var container = e('.section-container')
                container.innerHTML = ''
                // 把对应的数据加载到页面
                loadTodos()
                // 隐藏弹窗
                var alert = e('.alert-main-two')
                alert.remove()
            } else {
                // 隐藏弹窗
                var alert = e('.alert-main-two')
                alert.remove()
            }
        }
    })
}

var alertTwo = function(self, div, message) {
    // html
    var t = `
        <div class="alert-main-two">
        <div class="alert-bg"></div>
        <div class="alert-container">
            <div class="alert-title">提示信息</div>
            <div class="alert-message">${message}</div>
            <div class="alert-control">
                <button class="alert-button-two" type="button" data-type="ok">确定</button>
                <button class="alert-button-two" type="button" data-type="cancel">取消</button>
            </div>
        </div>
        </div>
    `
    // 插入页面
    var body = e('body')
    appendHtml(body, t)
    // 判断按钮,绑定事件、处理事件
    var button = self.innerHTML
    if(button === '完成') {
        bindAlertTwoDone(div)
    } else {
        bindAlertTwoDelete(div)
    }
}

// 绑定添加按钮的事件
var bindAdd = function() {
    var add = e('.button-add')
    add.addEventListener('click', function(event) {
        var self = event.target
        // 取到 input 的值
        var content = e('.todo-input-text').value
        if(content === '') {
            alertOne('添加的内容不能为空!')
        } else {
            // 计算 id
            if(localStorage.todoApp === JSON.stringify([]) || localStorage.todoApp === undefined) {
                id = 0
                localStorage.todoApp = JSON.stringify([])
            } else {
                var todos = JSON.parse(localStorage.todoApp)
                last = todos[todos.length - 1]
                id = last.id +　1
            }
            // 创建一个 todo
            var todo = {
                id: id,
                done: false,
                content: content,
            }
            // 保存到 localStorage.todoApp 中
            var todos = JSON.parse(localStorage.todoApp)
            todos.push(todo)
            localStorage.todoApp = JSON.stringify(todos)
            // 判断页面中的数据是否超过 10 个
            var container = e('.section-container')
            var todoAll = container.querySelectorAll('.section-container-todo')
            // log('todoAll', todoAll.length)
            if(todoAll.length >= 10) {
                // 跳转到最后一页
                var page = parseInt(e('.page-number').innerHTML)
                var todos = JSON.parse(localStorage.todoApp)
                var pages = Math.ceil(todos.length / 10)
                // log('测试效果', page, pages)
                // 更新页面上的页码
                e('.page-number').innerHTML = pages
                // 清空
                var container = e('.section-container')
                container.innerHTML = ''
                // 把对应的数据加载到页面
                loadTodos()
                // 添加完成后，把 input 里面的值清空
                e('.todo-input-text').value = ''
            } else {
                // 添加到页面上
                innerTodo(todo.id, todo.done, todo.content)
                // 添加完成后，把 input 里面的值清空
                e('.todo-input-text').value = ''
            }
        }
    })
}

// 绑定完成按钮的事件
var bindDone = function() {
    // 使用事件委托绑定在父节点上
    var container = e('.section-container')
    container.addEventListener('click', function(event) {
        var self = event.target
        if(self.classList.contains('button-done')) {
            // 弹窗信息
            var div = self.closest('.section-container-todo')
            var state = div.querySelector('.section-state').innerHTML
            var message = '已经做完了吗?'
            if(state === '完成') {
                message = '没做完啊!'
            }
            // log('点击到了完成按钮', event.target)
            alertTwo(self, div, message)
        }
    })
}

// 绑定删除按钮的事件
var bindDelete = function() {
    var container = e('.section-container')
    container.addEventListener('click', function(event) {
        var self = event.target
        var div = self.closest('.section-container-todo')
        if(self.classList.contains('button-delete')) {
            // 弹窗显示
            var message = '确定删除?不可撤销!'
            alertTwo(self, div, message)
        }
    })
}

// 绑定前进按钮的事件
var bindForward = function() {
    var buttonForward = e('.page-forward')
    buttonForward.addEventListener('click', function(event) {
        var self = event.target
        // 判断页码是否合法
        var page = parseInt(e('.page-number').innerHTML)
        var todos = JSON.parse(localStorage.todoApp)
        var pages = Math.ceil(todos.length / 10)
        // log('pages', pages)
        // 把页码加 1，载入对应的数据到页面上
        page ++
        // 判断页码是否合法
        if(page <= pages) {
            // 更新页面上的页码
            e('.page-number').innerHTML = page
            // 清空
            var container = e('.section-container')
            container.innerHTML = ''
            // 把对应的数据加载到页面
            loadTodos()
        } else {
            var message = '已经是最后一页了'
            alertOne(message)
        }
    })
}

// 绑定后退按钮的事件
var bindBack = function() {
    var buttonBack = e('.page-back')
    buttonBack.addEventListener('click', function(event) {
        // log('点击到了 后退按钮')
        var self = event.target
        // 判断页码是否合法
        var page = parseInt(e('.page-number').innerHTML)
        // 把页码减 1，载入对应的数据到页面上
        page = page - 1
        // log('page', page)
        // 判断页码是否合法
        if(page >= 1) {
            // 更新页面上的页码
            e('.page-number').innerHTML = page
            // 清空
            var container = e('.section-container')
            container.innerHTML = ''
            // 把对应的数据加载到页面
            loadTodos()
        } else {
            var message = '已经是第一页了'
            alertOne(message)
        }
    })
}

// 主函数（入口）
var __main = function() {
    // 载入页面时需要把 localStorage.todoApp 的值加载到页面上
    loadTodos()
    // 绑定添加按钮的事件
    bindAdd()
    // 绑定完成按钮的事件
    bindDone()
    // 绑定删除按钮的事件
    bindDelete()
    // 绑定前进按钮的事件
    bindForward()
    // 绑定后退按钮的事件
    bindBack()
}
__main()