import { useRef, useEffect } from 'react'
import classes from './flag.module.css'

interface FlagIconProps {
  active: boolean
}

const x = 30
const y = 60
const maxDeg = 12
let count = 0
let mode = -1

function rotateDegCalculate() {
  if (count >= maxDeg) {
    mode = -1
  } else if (count <= -maxDeg) {
    mode = 1
  }
  if (mode !== -1) {
    return count++
  } else {
    return count--
  }
}

export default function Flag(props: FlagIconProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const draw =
    (ctx: CanvasRenderingContext2D) =>
    (deg = 0) => {
      ctx.save()
      ctx.clearRect(0, 0, 200, 200)
      ctx.beginPath()
      ctx.translate(x, y + 15)
      ctx.rotate((deg * Math.PI) / 180)
      ctx.translate(-x, -y - 15)
      ctx.beginPath()
      ctx.lineWidth = 2
      ctx.strokeStyle = '#111'
      ctx.fillStyle = '#111'
      ctx.moveTo(x, y - 20)
      ctx.lineTo(x, y - 58)
      ctx.stroke()
      ctx.moveTo(x, y - 56)
      ctx.arc(x, y - 56, 2, 0, Math.PI * 2, true)
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(x, y - 50)
      ctx.bezierCurveTo(x + 3, y - 52, x + 6, y - 52, x + 9, y - 50)
      ctx.bezierCurveTo(x + 12, y - 48, x + 15, y - 48, x + 18, y - 50)
      ctx.lineTo(x + 18, y - 35)
      ctx.bezierCurveTo(x + 15, y - 33, x + 12, y - 33, x + 9, y - 35)
      ctx.bezierCurveTo(x + 6, y - 37, x + 3, y - 37, x, y - 35)
      ctx.fill()
      ctx.stroke()
      ctx.restore()
    }

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) draw(ctx)()
    }
  }, [])

  // * animate flag
  useEffect(() => {
    let timer
    if (props.active && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      timer = setInterval(() => {
        if (ctx) draw(ctx)(rotateDegCalculate())
      }, 10)
    } else if (canvasRef.current) {
      count = 0
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) draw(ctx)()
    }

    return () => clearInterval(timer)
  }, [props.active])
  return <canvas className={classes.icon} ref={canvasRef} width="70" height="50" />
}
