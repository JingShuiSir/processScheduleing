import { canvasFool } from '../canvas.js'
import {initObj} from '../init.js'
let lib = JSON.parse(JSON.stringify(initObj.lib))
lib.sort((a, b)=>{
    return (a.arrivalTime - b.arrivalTime)
})
//平均周转时间
let Avg_TurnAroundTime = 0
//设置FCFS要执行进程的数组
let FCFSlib = []
//进入过FCFSlib中的进程数量
let FCFSnum = 0
//总的时间轴
let time = 0
//距离要执行进程的时间
let timecell = 0
//上次的Startx
let lastx = 100
//执行完的进程数
let overNum = 0

function fcfsWait(){
    if(initObj.renew){
        lib = JSON.parse(JSON.stringify(initObj.lib))
        initObj.renew = 0
        init()
    }
    if(initObj.end){
        init()
        return
    }
    if(FCFSnum == lib.length && FCFSlib == []) return
    if(!FCFSlib[0]){
        if(!lib[FCFSnum]) return
        setTimeout(() => {
            FCFSlib.push(lib[FCFSnum])
            time = lib[FCFSnum].arrivalTime
            //canvas操作
            lastx = 102 + time/1000*50
            canvasFool.makeLine(102 + time/1000*50, 200, 102 + time/1000*50, 190, 'black', 2)
            canvasFool.makeText(time/1000 + 's', 95 + time/1000*50, 220, 100)
            //canvas操作
            FCFSnum++
            fcfsCarryOut()
        }, lib[FCFSnum].arrivalTime - time);
    }else{
        if(lib[FCFSnum].arrivalTime <= time){
            FCFSlib.push(lib[FCFSnum])
            FCFSnum++
            fcfsWait()
        }else{
            fcfsCarryOut()
        }
    }
}

//近等待
function nearWait(){
    if(FCFSnum == lib.length) return
    if(lib[FCFSnum].arrivalTime <= time){
        FCFSlib.push(lib[FCFSnum])
        FCFSnum++
        nearWait()
    }
}



//FCFS的执行时间
function fcfsCarryOut(){
    if(initObj.end){
        init()
        return
    }
    if(FCFSnum == lib.length && FCFSlib == []) return
    if(!FCFSlib[0]) {
        fcfsWait()
    }
    if(!FCFSlib[0]) return
    console.log(FCFSlib[0].processName + '开始执行')


    timecell = FCFSlib[0].processTime

    setTimeout(() => {
        time += timecell
        console.log(FCFSlib[0].processName + '执行完毕，时间轴第' + time/1000 + 's')
        overNum++
        //为canvas添加线条
        {
            canvasFool.makeLine(lastx, 200, 102 + time/1000*50, 200, FCFSlib[0].color, 10)
            canvasFool.makeLine(102 + time/1000*50, 200, 102 + time/1000*50, 190, 'black', 2)
            canvasFool.makeText(time/1000 + 's', 95 + time/1000*50, 220, 100)
            canvasFool.makeText(FCFSlib[0].processName, 75 + time/1000*50, 190, 100)
            lastx = 102 + time/1000*50
        }


        nearWait()
        // FCFSlib[0].processTime -= timecell


            {
                //为进程添加工作完成时的时间
                lib.forEach((value, index)=>{
                    if(value.processName == FCFSlib[0].processName){
                        value.lastTime = time
                        value.Turn_AroundTime = value.lastTime - value.arrivalTime
                        Avg_TurnAroundTime += value.Turn_AroundTime
                        console.log('---------------')
                        console.log(FCFSlib[0].processName + '的周转时间为' + value.Turn_AroundTime/1000 + 's')
                        console.log('---------------')
                    }
                })
                if(overNum == lib.length){
                    initObj.end = true
                    canvasFool.makeText('平均周转时间为' + Avg_TurnAroundTime/FCFSnum/1000, 50, 50, 200)
                    console.log('平均周转时间为' + Avg_TurnAroundTime/FCFSnum/1000)
                    console.log(Avg_TurnAroundTime/1000/FCFSnum)
                    return
                }
            }


            FCFSlib.shift()
        
        fcfsCarryOut()
    }, timecell);
}




//恢复出厂设置
function init(){
    lib = JSON.parse(JSON.stringify(initObj.lib))
    lib.sort((a, b)=>{
        return (a.arrivalTime - b.arrivalTime)
    })
    Avg_TurnAroundTime = 0
    FCFSlib = []
    FCFSnum = 0
    time = 0
    timecell = 0
    lastx = 100
    initObj.end = false
}

export {fcfsWait}