//初始化的相关方法
const initObj = {
    //存放进程的数组（默认）
    lib: [{
        processName: 'A',
        arrivalTime: 4000,
        processTime: 5000,
        priority: '4',
        color: 'red'
    },{
        processName: 'B',
        arrivalTime: 0,
        processTime: 3000,
        priority: '2',
        color: 'blue'
    },{
        processName: 'C',
        arrivalTime: 6000,
        processTime: 2000,
        priority: '3',
        color: 'yellow'
    },{
        processName: 'D',
        arrivalTime: 6000,
        processTime: 6000,
        priority: '1',
        color: 'green'
    }],
    //进程数量
    processNum: 4,
    //时间片
    timeSlice: 2000,
    //是否调度结束
    end: false,
    //存放所选择的信息
    SelectMsg: null,
    //设置所选函数
    CarryOutFun: null,
    //是否进行过库的更改
    renew: 0,
    //插入进程
    insert(){
        this.renew = 1
        let num = prompt('你想输入几个进程呢？')
        let order = 0
        while(1){
            if(num == 0){
                break
            }
            order ++
            if(!this.timeSlice){
                this.timeSlice = prompt('时间片大小(单位:s)') * 1000
            }
            let processName = prompt(`${order}、进程的名字`)
            let arrivalTime = prompt(`${order}、到达时间`)
            let processTime = prompt(`${order}、执行完程序所需要的时间`)
            let priority = prompt(`${order}、优先级`)
            for(let i = 0; i < this.lib.length; i++){
                if(this.lib[i].processName == processName){
                    alert(`你的进程名字重复或错误，请重新输入`)
                    processName = prompt(`${order}、进程的名字`)
                }
                if(!priority.match(/^[0-9]$/)){
                    alert(`你的优先级不规范，请重新输入`)
                    priority = prompt(`${order}、优先级`)
                }
                // if(!arrivalTime.match(/^[0-9]+$/)){
                //     alert('你的到达时间不规范，请重新输入')
                //     arrivalTime = prompt(`${order}、到达时间`)
                // }
                if(!processTime.match(/^[0-9]+$/)){
                    alert('你的执行时间不规范，请重新输入')
                    processTime = prompt(`${order}、执行完程序所需要的时间`)
                }
            }
            let obj = {
                processName: processName,
                arrivalTime: arrivalTime * 1000,
                processTime: processTime * 1000,
                priority: priority,
                color: `rgb(${parseInt(Math.random() * 255)}, ${parseInt(Math.random() * 255)}, ${parseInt(Math.random() * 255)})`
            }
            this.lib.push(obj)
            this.processNum ++
            num --
        }
        this.lib.sort((a, b)=>{
            return (a.arrivalTime - b.arrivalTime)
        })
        console.log(this.lib)
    },
    //清除所有进程
    clear(){
        this.renew = 1
        this.lib = []
        this.end = true
    },
    //终止进程
    endItem(SelectMsg){
        if(SelectMsg == null) return
        this.end = true
    },
    //清除画布
    clearCanvas(){
        this.renew = 1
        this.end = true
        console.log(this.lib)
    },
    //开始
    start(item){
        this.end = false
        if(item == null) return
        item()
    }
}
export {initObj}






