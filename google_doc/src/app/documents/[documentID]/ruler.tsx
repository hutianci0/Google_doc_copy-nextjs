import { useMutation, useStorage } from '@liveblocks/react/suspense'
import { useRef, useState } from 'react'
import { FaCaretDown } from 'react-icons/fa'
const markers = Array.from({ length: 83 }, (_, i) => i)

export const Ruler = () => {
  // shared state for other user
  // const [leftMargin, setLeftMargin] = useState(56)
  // const [rightMargin, setRightMargin] = useState(56)
  const [isDraggingLeft, setIsDraggingLeft] = useState(false)
  const [isDraggingRight, setIsDraggingRight] = useState(false)
  const rulerRef = useRef<HTMLDivElement>(null)

  const leftMargin = useStorage((root) => root.leftMargin) ?? 56
  const setLeftMargin = useMutation(({ storage }, position: number) => {
    storage.set('leftMargin', position)
  }, [])

  const rightMargin = useStorage((root) => root.rightMargin) ?? 56
  const setRightMargin = useMutation(({ storage }, position: number) => {
    storage.set('rightMargin', position)
  }, [])

  const handleMouseDownLeft = () => {
    setIsDraggingLeft(true)
  }

  const handleMouseDownRight = () => {
    setIsDraggingRight(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    // 1. marker follow cursor on X-axis
    // 2. left marker or right marker cannot go over each other
    // 3. a bit space when marker meets

    if ((isDraggingLeft || isDraggingRight) && rulerRef.current) {
      const container = rulerRef.current.querySelector('#ruler-container')
      if (container) {
        // 求出鼠标相对于容器的位置, 并做出限制 0 - 816px
        const containerRect = container.getBoundingClientRect()
        const cursorX = e.clientX - containerRect.left
        const rawPosition = Math.max(0, Math.min(816, cursorX))

        if (isDraggingLeft) {
          // 100 空隙 且不能超过rightMargin
          const maxLeftPoistion = 816 - rightMargin - 100
          const newLeftPosition = Math.min(maxLeftPoistion, rawPosition)
          setLeftMargin(newLeftPosition)
        } else if (isDraggingRight) {
          const maxRightPosition = 816 - leftMargin - 100
          // 从右向左计算, rawPosition是相对于左
          const newRightPosition = Math.max(816 - rawPosition, 0)
          const contrainedRightPosition = Math.min(maxRightPosition, newRightPosition)
          setRightMargin(contrainedRightPosition)
        }
      }
    }
  }

  const handleMouseUp = () => {
    setIsDraggingLeft(false)
    setIsDraggingRight(false)
  }

  // DoubleClick: reset to default
  const handleLeftDoubleClick = () => {
    setLeftMargin(56)
  }
  const handleRightDoubleClick = () => {
    setRightMargin(56)
  }

  return (
    <div
      className="w-[816px] mx-auto h-6  border-b border-gray-300 flex items-end relative select-none print:hidden"
      ref={rulerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div id="ruler-container" className="w-full h-full relative">
        {/* marker: 56px matches editor padding */}
        <Marker
          position={leftMargin}
          isLeft={true}
          isDragging={isDraggingLeft}
          onDoubleClick={handleLeftDoubleClick}
          onMouseDown={handleMouseDownLeft}
        />
        <Marker
          position={rightMargin}
          isLeft={false}
          isDragging={isDraggingRight}
          onDoubleClick={handleRightDoubleClick}
          onMouseDown={handleMouseDownRight}
        />
        <div className="absolute inset-x-0 bottom-0 h-full">
          <div className="relative h-full w-[816px]">
            {markers.map((marker) => {
              const position = (marker * 816) / 82
              return (
                <div key={marker} className="absolute bottom-0" style={{ left: `${position}px` }}>
                  {marker % 10 === 0 && (
                    <>
                      {' '}
                      <div className="absolute bottom-0 text-primary w-[1px] h-2 bg-neutral-500" />
                      <span className="absolute bottom-2 text-[10px] text-neutral-500 transform -translate-x-1/2">
                        {marker / 10 + 1}
                      </span>
                    </>
                  )}

                  {marker % 5 === 0 && marker % 10 !== 0 && (
                    <div className="absolute bottom-0 w-[1px] h-1.5 bg-neutral-500" />
                  )}
                  {marker % 10 !== 0 && marker % 5 !== 0 && (
                    <div className="absolute bottom-0 w-[1px] h-1 bg-neutral-500" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

interface MarkerProps {
  position: number
  isLeft: boolean
  isDragging: boolean
  onDoubleClick: () => void
  onMouseDown: () => void
}

const Marker = ({ position, isLeft, isDragging, onDoubleClick, onMouseDown }: MarkerProps) => {
  return (
    <div
      className="absolute top-0 w-4 h-full cursor-ew-resize z-[5] group -ml-2"
      // [dyanmic key] for object
      style={{ [isLeft ? 'left' : 'right']: `${position}px` }}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
    >
      <FaCaretDown className="absolute left-1/2 top-0 h-full fill-blue-500 transform -translate-x-1/2" />
      {/* margin indicator */}
      <div
        className="absolute left-1/2 top-4 transform -translate-x-1/2"
        style={{
          height: '100vh',
          width: '1px',
          transform: 'scaleX(0.5)',
          backgroundColor: '#3b72f6',
          display: isDragging ? 'block' : 'none',
        }}
      />
    </div>
  )
}
