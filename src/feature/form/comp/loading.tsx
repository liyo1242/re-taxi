import { useRef, useEffect } from 'react'
import classes from './loading.module.css'

interface LoadingIconProps {
  active: boolean
  size: number
}

export default function Loading(props: LoadingIconProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.save()
    ctx.clearRect(0, 0, props.size, props.size)
    ctx.translate(props.size / 2, props.size / 2)
    ctx.rotate((Math.PI * 360) / 360)
    ctx.lineWidth = Math.ceil(props.size / 50)
    ctx.lineCap = 'square'

    for (let i = 0; i <= 360; i++) {
      ctx.save()
      ctx.rotate((Math.PI * i) / 180)
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.strokeStyle = 'rgba(0,0,0,' + ((360 - i * 0.95) / 360).toFixed(2) + ')'
      ctx.lineTo(0, props.size + 30)
      ctx.stroke()
      ctx.closePath()
      ctx.restore()
    }

    ctx.globalCompositeOperation = 'source-out'
    ctx.beginPath()
    ctx.arc(0, 0, props.size / 2, 2 * Math.PI, 0, false)
    ctx.fillStyle = 'black'
    ctx.fill()

    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(0, 0, (props.size / 2) * 0.9, 2 * Math.PI, 0, false)
    ctx.fill()
    ctx.restore()
  }

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) draw(ctx)
    }
  }, [canvasRef.current])

  return (
    <canvas
      className={classes.icon}
      style={{ display: props.active ? 'inline' : 'none' }}
      ref={canvasRef}
      width={props.size}
      height={props.size}
    />
  )
}
