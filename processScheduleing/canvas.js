import {ctx} from './run.js'

let canvasFool = {
    makeLine: makeLine,
    makeText(text,x,y,maxWidth){
        ctx.font = '20px Arial';
        ctx.fillText(text,x,y,maxWidth);
    }
}

//制造直线的函数
function makeLine(Startx, Starty, Endx, Endy, color, lineWidth){
    ctx.beginPath()
    ctx.moveTo(Startx, Starty)
    ctx.lineTo(Endx, Endy)
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.stroke()
}

export {canvasFool}