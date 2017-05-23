/*
1，基础 html
2，获取输入框内容，生成 html，插入 html 到页面，并保存数据到 localStorage
3，绑定事件，完成，删除功能，保存操作后的结果到 localStorage
4，翻页，一页展示 10 个 todo，多余的展示在下一页，以此类推
5，各种页码对应内容
6，页码点击
7，上一页，下一页按钮
*/

//辅助函数
//定义 log 函数
const log = function() {
    console.log.apply(console, arguments)
}

//定义 toggleClass 函数
const toggleClass = function(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }
}

// removeClassAll() 删除所有的class
const removeClassAll = function(className) {
    var selector = '.' + className
    var elements = document.querySelectorAll(selector)
    for (var i = 0; i < elements.length; i++) {
        var e = elements[i]
        e.classList.remove(className)
    }
}


//功能函数
//定义 生成要插入的 html 的函数
var templateTodo = function(todo, done, id) {
    //把 todo 内容，和完成状态的 class 一起写入
    //默认未完成(设置完成状态的class名为空)
    var status = ''
    var describe = '未完成'
    //如果 done 为 true，则说明这条 todo 是已完成状态
    if (done) {
        //就加上 'done' 这个 css
        status = 'done'
        //把描述改成'完成'
        describe = '完成'
    }
    var t = `
            <div class="todos ${status}" data-id=${id}>
                <span class="todo_content">${todo}</span>
                <span class="state">${describe}</span>
                <div class="control_buttons">
                    <button class="button_done" type="button">完成</button>
                    <button class="button_delete" type="button">删除</button>
                </div>
            </div>
        `
        return t
}

//定义 插入一个 todo 到页面中 的函数
var insertTodo = function(todo, done, id) {
    var container = document.querySelector('.container')
    // t 是 生成的 html 段落
    var t = templateTodo(todo, done, id)
    container.innerHTML += t
}

//展示某一页(参数)的 todo
var loadTodos = function(page) {
    //得到 localStorage 中所有存储的 todo
    var todos = JSON.parse(localStorage.todos)
    //清空屏幕
    var existingtodos = document.querySelector('.container')
    existingtodos.innerHTML = ''
    //得到要展示的 todo 的 开始、结束 下标
    var end = page * 10
    var start = end - 10
    //判断这一页是否有内容，如果没有内容就显示前一页的
    if (todos[start] == undefined) {
        var page = page - 1
        end = page * 10
        start = end - 10
    }
    //遍历 todos，循环插入到页面
    for (var i = start; i < end; i++) {
        var todo = todos[i]
        if (todo != undefined) {
            insertTodo(todo.content, todo.done, todo.id)
        }
    }
    //改变页码的 css
    //找到所有页码的 span
    var page_number = document.querySelectorAll('.page_number')
    //循环比较，得到要改变外观的元素，加上一个 class
    for (var i = 0; i < page_number.length; i++) {
        //p = 每一个 span
        var p = page_number[i]
        if (p.classList[0].slice(-1) == page) {
            removeClassAll('active')
            p.classList.add('active')
            break
        }
    }
}


//根据点击的页码 展示不超过 10 个 todo
var pageLoadTodos = function(event) {
    var e = event.target
    //log('e is',e)
    //得到 localStorage 中所有存储的 todo
    var todos = JSON.parse(localStorage.todos)
    //得到当前点击的页码
    //判断点击的是页码
    if (e.classList.contains('page_number')) {
        //改变页码颜色
        removeClassAll('active')
        e.classList.add('active')
        //找出在 class 存的页码
        var page = e.classList[0].slice(-1)
        //log('页码 is',page)
        //算出要展示的 todo 的下标
        var secondNum = page * 10
        var firstNum = secondNum - 10
        //删除已经显示的 todo
        var container = document.querySelector('.container')
        container.innerHTML = ''
        //遍历 todos，循环插入到页面
        for (var i = firstNum; i < secondNum; i++) {
            var todo = todos[i]
            if (todo != undefined) {
                insertTodo(todo.content, todo.done, todo.id)
            }
        }
    }
}

// 创建页码 ，根据 todo 的数量创建相应数量的页码
var insertPagination = function() {
    var pagination = document.querySelector('.pagination')
    var todos = JSON.parse(localStorage.todos)
    var length = todos.length
    //向上取整，算出有几页(每页展示 10 个)
    var number = Math.ceil(length / 10)
    //向 pagination 中添加页码
    var pagination = document.querySelector('.pagination')
    //第一页一直存在
    pagination.innerHTML = '<span class="page_1 page_number active">1</span>'
    //第一页默认一直存在，从第二页开始
    for (var i = 2; i <= number; i++) {
        var t = `
            <span class="page_${i} page_number">${i}</span>
        `
        pagination.innerHTML += t
    }
}

//保存 input 输入的 todo 数据到 localStorage
var addLocalStorageTodo = function() {
    var input = document.querySelector('.new_todo_input')
    var val = input.value
    //创建一个 todo 模版
    var todo = {
        id: 0,
        done: false,
        content: val,
    }
    //判断 localStorage 中有无数据
    //如果空的或者删完了，就直接把新 todo 存进去
    //否则有数据，则解析出来，再加上新的数据，再存进去
    var emptyArray = JSON.stringify([])
    if (localStorage.todos == undefined ||localStorage.todos == emptyArray) {
        var todos = []
        todos.push(todo)
        localStorage.todos = JSON.stringify(todos)
    }else {
        var todos = JSON.parse(localStorage.todos)
        lastTodo = todos[todos.length - 1]
        todo.id = lastTodo.id + 1
        todos.push(todo)
        localStorage.todos = JSON.stringify(todos)
    }
    //把 todo 展示到页面
    //检查添加到了第几页的量，展示这一页
    //算出该展示哪一页的数据
    var parseTodos = JSON.parse(localStorage.todos)
    var length = parseTodos.length
    var page = Math.ceil(length / 10)
    //刷新页码
    insertPagination()
    //展示这一页
    loadTodos(page)
}

//定义 完成、删除按钮功能 函数
var operatingButtons = function(event) {
    var e = event.target
    if (e.classList.contains('button_delete')) {
        //如果是删除按钮
        // closest()方法，往上层节点找到第一个包含参数（元素选择器）的节点
        var p = e.closest('.todos')
        //更新页面
        //判断在第几页点的删除，用此 todo 的 id，遍历 todos 得到下标
        var todos = JSON.parse(localStorage.todos)
        var length = todos.length
        var dataId = p.dataset.id
        //得到下标
        for (var j = 0; j < todos.length; j++) {
            var t = todos[j]
            if (t.id == dataId) {
                var index = j
                break
            }
        }
        //得到下标所处的页码(用于展示当前页)
        var nowPage = Math.floor(index / 10) + 1
        //删除 localStorage 中的相应数据
        //通过这个节点存的 data-id 来删除 localStorage 中的数据
        var dataId = p.dataset.id
        var todos = JSON.parse(localStorage.todos)
        var len = todos.length
        for (var i = 0; i < len; i++) {
            var todo = todos[i]
            if (todo.id == dataId) {
                todos.splice(i, 1)
                break
            }
        }
        //保存删除当前 todo 后的数据到 localStorage
        localStorage.todos = JSON.stringify(todos)
        //更新页码
        insertPagination()
        //展示这一页的全部数据
        loadTodos(nowPage)
    } else if (e.classList.contains('button_done')) {
        //如果是完成按钮
        var p = e.closest('.todos')
        //切换一个 class
        toggleClass(p, 'done')
        var state = p.querySelector('.state')
        //改变完成状态描述
        if (state.innerText == '未完成') {
            state.innerText = '完成'
        } else {
            state.innerText = '未完成'
        }
        //保存状态结果到 localStorage ，替换原来的数据
        var dataId = p.dataset.id
        var todos = JSON.parse(localStorage.todos)
        var len = todos.length
        for (var i = 0; i < len; i++) {
            var todo = todos[i]
            //toggle 一个布尔值
            if (todo.id == dataId) {
                if (todo.done == true) {
                    todo.done = false
                }else {
                    todo.done = true
                }
                break
            }
        }
        //保存删除当前 todo 后的数据到 localStorage
        localStorage.todos = JSON.stringify(todos)
    }
}

//下一页 函数
var nextPage = function() {
    //获取当前页面的页码
    var pageNumbers = document.querySelectorAll('.page_number')
    for (var i = 0; i < pageNumbers.length; i++) {
        var p = pageNumbers[i]
        if (p.classList.contains('active')) {
            var oldPage = p.classList[0].slice(-1)
            break
        }
    }
    //算出下一页的页码
    var nextPage = parseInt(oldPage) + 1
    //把下一页加载到页面
    loadTodos(nextPage)
}

//上一页 函数
var lastPage = function() {
    //获取当前页码
    var pageNumbers = document.querySelectorAll('.page_number')
    for (var i = 0; i < pageNumbers.length; i++) {
        var p = pageNumbers[i]
        if (p.classList.contains('active')) {
            var oldPage = p.classList[0].slice(-1)
            break
        }
    }
    //算出上一页的页码，判断当前是否第一页
    var nextPage = parseInt(oldPage) - 1
    if (nextPage == 0) {
        nextPage = 1
    }
    //加载上一页的内容到页面
    loadTodos(nextPage)
}

//绑定事件
//给 add 按钮绑定事件，添加 todo 项目
var bindAdd = function() {
    var addButton = document.querySelector('.button_addtodo')
    addButton.addEventListener('click', addLocalStorageTodo)
}

//委托绑定删除、完成按钮事件
var bindOperatingButtons = function() {
    var all = document.querySelector('.all')
    all.addEventListener('click', operatingButtons)
}

//委托页码点击事件
var bindPageNumber = function() {
    var pagination = document.querySelector('.pagination')
    pagination.addEventListener('click', pageLoadTodos)
}

// 绑定下一页按钮事件
var bindNextButton = function() {
    var nextPageButton = document.querySelector('.next_page')
    nextPageButton.addEventListener('click', nextPage)
}

// 绑定上一页按钮事件
var bindLastButton = function() {
    var lastPageButton = document.querySelector('.last_page')
    lastPageButton.addEventListener('click', lastPage)
}

//绑定所有事件集合
var bindAll = function() {
    bindAdd()
    bindOperatingButtons()
    bindPageNumber()
    bindNextButton()
    bindLastButton()
}

//主函数
var __main = function() {
    bindAll()
    //创建页码
    insertPagination()
    //默认加载第一页的 todo
    loadTodos(1)
}

//程序入口
__main()
