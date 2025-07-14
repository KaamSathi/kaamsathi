"use client"

import type React from "react"

import { useCallback } from "react"

type KeyboardNavOptions = {
  onEnter?: () => void
  onSpace?: () => void
  onArrowUp?: () => void
  onArrowDown?: () => void
  onArrowLeft?: () => void
  onArrowRight?: () => void
  onEscape?: () => void
  onTab?: () => void
  onShiftTab?: () => void
  preventDefault?: boolean
}

export function useKeyboardNav(options: KeyboardNavOptions) {
  const {
    onEnter,
    onSpace,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onEscape,
    onTab,
    onShiftTab,
    preventDefault = true,
  } = options

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "Enter":
          if (onEnter) {
            if (preventDefault) e.preventDefault()
            onEnter()
          }
          break
        case " ":
          if (onSpace) {
            if (preventDefault) e.preventDefault()
            onSpace()
          }
          break
        case "ArrowUp":
          if (onArrowUp) {
            if (preventDefault) e.preventDefault()
            onArrowUp()
          }
          break
        case "ArrowDown":
          if (onArrowDown) {
            if (preventDefault) e.preventDefault()
            onArrowDown()
          }
          break
        case "ArrowLeft":
          if (onArrowLeft) {
            if (preventDefault) e.preventDefault()
            onArrowLeft()
          }
          break
        case "ArrowRight":
          if (onArrowRight) {
            if (preventDefault) e.preventDefault()
            onArrowRight()
          }
          break
        case "Escape":
          if (onEscape) {
            if (preventDefault) e.preventDefault()
            onEscape()
          }
          break
        case "Tab":
          if (e.shiftKey && onShiftTab) {
            if (preventDefault) e.preventDefault()
            onShiftTab()
          } else if (!e.shiftKey && onTab) {
            if (preventDefault) e.preventDefault()
            onTab()
          }
          break
      }
    },
    [onEnter, onSpace, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, onEscape, onTab, onShiftTab, preventDefault],
  )

  return handleKeyDown
}
