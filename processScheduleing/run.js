import {initObj} from './init.js'
import {rrWait} from './js/RR.js'
import {fcfsWait} from './js/FCFS.js'
import {priWait} from './js/Priority.js'
import {canvasFool} from './canvas.js'

// //设置按钮所选择的函数
// let CarryOutFun = null

//canvas操作
let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')

let select = document.querySelector('#sempSelect')
//存放所选择的信息
// let SelectMsg = null
// //添加所选属性到SelectMsg
select.addEventListener('click', function(ev){
    var target = ev.target
    initObj.SelectMsg = target.value
    switch(initObj.SelectMsg){
        case 'RR':
            initObj.CarryOutFun = rrWait
            break
        case 'FCFS':
            initObj.CarryOutFun = fcfsWait
            break
        case 'Priority':
            initObj.CarryOutFun = priWait
            break
        default:
            initObj.CarryOutFun = null
            break
    }
})


//处理按钮们
let btn_insert = document.querySelector('.btn-insert')
btn_insert.addEventListener('click', ()=>{
    initObj.insert()
})
let btn_clear = document.querySelector('.btn-clear')
btn_clear.addEventListener('click', ()=>{
    initObj.clear()
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.height)
})
let btn_end = document.querySelector('.btn-end')
btn_end.addEventListener('click', ()=>{
    initObj.endItem(initObj.SelectMsg)
})
let btn_start = document.querySelector('.btn-start')
    btn_start.addEventListener('click', ()=>{
    canvastest()
    initObj.start(initObj.CarryOutFun)
})
let btn_clearCanvas = document.querySelector('.btn-clearCanvas')
btn_clearCanvas.addEventListener('click', ()=>{
    initObj.clearCanvas()
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.height)
})


function canvastest(){
    canvasFool.makeLine(100, 200, 1000, 200, 'black', 2)
    canvasFool.makeLine(102  , 200, 102  , 190, 'black', 2)
    canvasFool.makeText('0s', 95 , 220, 100)
    //canvas操作
}
export {ctx}

