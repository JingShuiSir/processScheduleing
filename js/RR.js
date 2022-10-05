import { canvasFool } from '../canvas.js'
import {initObj} from '../init.js'
let lib = JSON.parse(JSON.stringify(initObj.lib))
lib.sort((a, b)=>{
    return (a.arrivalTime - b.arrivalTime)
})
//平均周转时间
let Avg_TurnAroundTime = 0
//设置RR要执行进程的数组
let RRlib = []
//进入过RRlib中的进程数量
let RRnum = 0
//总的时间轴
let time = 0
//距离要执行进程的时间
let timecell = 0
//时间片
let timeSlice = 0
//上次的Startx
let lastx = 100
//执行完的进程数
let overNum = 0
//RR的等待时间
function rrWait(){
    if(initObj.renew){
        lib = JSON.parse(JSON.stringify(initObj.lib))
        initObj.renew = 0
        init()
    }
    if(initObj.end){
        init()
        return
    }
    //判断时间片是否就绪
    if(!timeSlice) timeSlice = initObj.timeSlice
    if(RRnum == lib.length && RRlib == []) return
    if(!RRlib[0]){
        if(!lib[RRnum]) return
        setTimeout(() => {
            RRlib.push(lib[RRnum])
            time = lib[RRnum].arrivalTime

            lastx = 102 + time/1000*50
            canvasFool.makeLine(102 + time/1000*50, 200, 102 + time/1000*50, 190, 'black', 2)
            canvasFool.makeText(time/1000 + 's', 95 + time/1000*50, 220, 100)

            RRnum++
            rrCarryOut()
        }, lib[RRnum].arrivalTime - time);
    }else{
        if(lib[RRnum].arrivalTime <= time){
            RRlib.push(lib[RRnum])
            RRnum++
            rrWait()
        }else{
            rrCarryOut()
        }
    }

}
//近等待
function nearWait(){
    if(RRnum == lib.length) return
    if(lib[RRnum].arrivalTime <= time){
        RRlib.push(lib[RRnum])
        RRnum++
        nearWait()
    }
}

//RR的执行时间
function rrCarryOut(){
    //判断调度是否已经被终止
    if(initObj.end){
        init()
        return
    }
    if(RRnum == lib.length && RRlib == []) return
    //判断就绪队列是否为空
    if(!RRlib[0]) {
        rrWait()
    }
    if(!RRlib[0]) return

    
    console.log(RRlib[0].processName + '开始执行')


    timecell = RRlib[0].processTime <= timeSlice ? RRlib[0].processTime : timeSlice

    setTimeout(() => {
        time += timecell
        console.log(RRlib[0].processName + '时间片执行完毕，时间轴第' + time/1000 + 's')

        //为canvas添加线条
        {
            canvasFool.makeLine(lastx, 200, 102 + time/1000*50, 200, RRlib[0].color, 10)
            canvasFool.makeLine(102 + time/1000*50, 200, 102 + time/1000*50, 190, 'black', 2)
            canvasFool.makeText(time/1000 + 's', 95 + time/1000*50, 220, 100)
            canvasFool.makeText(RRlib[0].processName, 75 + time/1000*50, 190, 100)
            lastx = 102 + time/1000*50
        }


        nearWait()
        RRlib[0].processTime -= timecell
        if(RRlib[0].processTime <= 0){
            console.log(RRlib[0].processName + '执行完毕，时间轴第' + time/1000 + 's')
            overNum++

            {
                //为进程添加工作完成时的时间
                lib.forEach((value, index)=>{
                    if(value.processName == RRlib[0].processName){
                        value.lastTime = time
                        value.Turn_AroundTime = value.lastTime - value.arrivalTime
                        Avg_TurnAroundTime += value.Turn_AroundTime
                        console.log('---------------')
                        console.log(RRlib[0].processName + '的周转时间为' + value.Turn_AroundTime/1000 + 's')
                        console.log('---------------')
                    }
                })
                if(overNum == lib.length){
                    initObj.end = true
                    canvasFool.makeText('平均周转时间为' + Avg_TurnAroundTime/RRnum/1000, 50, 50, 200)
                    console.log('平均周转时间为' + Avg_TurnAroundTime/RRnum/1000)
                    console.log(Avg_TurnAroundTime/1000/RRnum)
                    return
                }
            }


            RRlib.shift()
        }else{
            let arr = RRlib.shift()
            RRlib.push(arr)
        }
        rrCarryOut()
    }, timecell);
}

//恢复出厂设置
function init(){
    lib = JSON.parse(JSON.stringify(initObj.lib))
    lib.sort((a, b)=>{
        return (a.arrivalTime - b.arrivalTime)
    })
    Avg_TurnAroundTime = 0
    RRlib = []
    RRnum = 0
    time = 0
    timecell = 0
    timeSlice = 0
    lastx = 100
    initObj.end = false
}

export {rrWait}
