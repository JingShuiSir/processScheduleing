import { canvasFool } from '../canvas.js'
import {initObj} from '../init.js'
let lib = JSON.parse(JSON.stringify(initObj.lib))
lib.sort((a, b)=>{
    return (a.arrivalTime - b.arrivalTime)
})
//平均周转时间
let Avg_TurnAroundTime = 0
//设置Pri要执行进程的数组
let Prilib = []
//进入过Prilib中的进程数量
let Prinum = 0
//总的时间轴
let time = 0
//距离要执行进程的时间
let timecell = 0
//上次的Startx
let lastx = 100
//执行完的进程数
let overNum = 0
function priWait(){
    if(initObj.renew){
        lib = JSON.parse(JSON.stringify(initObj.lib))
        initObj.renew = 0
        init()
    }
    if(initObj.end){
        init()
        return
    }
    if(Prinum == lib.length && Prilib == []) return
    if(!Prilib[0]){
        if(!lib[Prinum]) return
        setTimeout(() => {
            Prilib.push(lib[Prinum])
            time = lib[Prinum].arrivalTime
            //canvas操作
            lastx = 102 + time/1000*50
            canvasFool.makeLine(102 + time/1000*50, 200, 102 + time/1000*50, 190, 'black', 2)
            canvasFool.makeText(time/1000 + 's', 95 + time/1000*50, 220, 100)
            //canvas操作
            Prinum++
            priCarryOut()
        }, lib[Prinum].arrivalTime - time)
    }else{
        if(lib[Prinum].arrivalTime <= time){
            Prilib.push(lib[Prinum])
            Prinum++
            priWait()
        }else{
            priCarryOut()
        }
    }
}

//近等待
function nearWait(){
    if(Prinum == lib.length) return
    if(lib[Prinum].arrivalTime <= time){
        Prilib.push(lib[Prinum])
        Prinum++
        nearWait()
    }
}



//Pri的执行时间
function priCarryOut(){
    if(initObj.end){
        init()
        return
    }
    if(Prinum == lib.length && Prilib == []) return
    if(!Prilib[0]) {
        priWait()
    }
    if(!Prilib[0]) return
    console.log(Prilib[0].processName + '开始执行')


    timecell = Prilib[0].processTime

    setTimeout(() => {
        time += timecell
        console.log(Prilib[0].processName + '执行完毕，时间轴第' + time/1000 + 's')
        overNum++
        //为canvas添加线条
        {
            canvasFool.makeLine(lastx, 200, 102 + time/1000*50, 200, Prilib[0].color, 10)
            canvasFool.makeLine(102 + time/1000*50, 200, 102 + time/1000*50, 190, 'black', 2)
            canvasFool.makeText(time/1000 + 's', 95 + time/1000*50, 220, 100)
            canvasFool.makeText(Prilib[0].processName, 75 + time/1000*50, 190, 100)
            lastx = 102 + time/1000*50
        }


        nearWait()



        {
            //为进程添加工作完成时的时间
            lib.forEach((value, index)=>{
                if(value.processName == Prilib[0].processName){
                    value.lastTime = time
                    value.Turn_AroundTime = value.lastTime - value.arrivalTime
                    Avg_TurnAroundTime += value.Turn_AroundTime
                    console.log('---------------')
                    console.log(Prilib[0].processName + '的周转时间为' + value.Turn_AroundTime/1000 + 's')
                    console.log('---------------')
                }
            })
            if(overNum == lib.length){
                initObj.end = true
                canvasFool.makeText('平均周转时间为' + Avg_TurnAroundTime/Prinum/1000, 50, 50, 200)
                console.log('平均周转时间为' + Avg_TurnAroundTime/Prinum/1000)
                console.log(Avg_TurnAroundTime/1000/Prinum)
                return
            }
        }
        Prilib.shift()

        Prilib.sort((a, b)=>{
            return (a.priority - b.priority)
        })

        priCarryOut()
    }, timecell);
}




//恢复出厂设置
function init(){
    lib = JSON.parse(JSON.stringify(initObj.lib))
    lib.sort((a, b)=>{
        return (a.arrivalTime - b.arrivalTime)
    })
    Avg_TurnAroundTime = 0
    Prilib = []
    Prinum = 0
    time = 0
    timecell = 0
    lastx = 100
    initObj.end = false
}

export {priWait}