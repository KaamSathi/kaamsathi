"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

interface VideoBackgroundProps {
  videoSrc: string
  fallbackImageSrc: string
  alt: string
  isActive: boolean
  gradient: string
}

export default function VideoBackground({ videoSrc, fallbackImageSrc, alt, isActive, gradient }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [hasVideoError, setHasVideoError] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  // Handle video loading and playback
  useEffect(() => {
    const videoElement = videoRef.current

    if (!videoElement) return

    const handleCanPlay = () => {
      setIsVideoLoaded(true)
    }

    const handleError = () => {
      setHasVideoError(true)
      console.warn("Video failed to load, falling back to image:", videoSrc)
    }

    const handlePlay = () => {
      setIsPlaying(true)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    videoElement.addEventListener("canplay", handleCanPlay)
    videoElement.addEventListener("error", handleError)
    videoElement.addEventListener("play", handlePlay)
    videoElement.addEventListener("pause", handlePause)

    return () => {
      videoElement.removeEventListener("canplay", handleCanPlay)
      videoElement.removeEventListener("error", handleError)
      videoElement.removeEventListener("play", handlePlay)
      videoElement.removeEventListener("pause", handlePause)
    }
  }, [videoSrc])

  // Separate effect for handling play/pause based on isActive
  useEffect(() => {
    const videoElement = videoRef.current

    if (!videoElement || hasVideoError) return

    let timeoutId: NodeJS.Timeout

    if (isActive && isVideoLoaded) {
      // Small delay to ensure the video element is ready
      timeoutId = setTimeout(async () => {
        try {
          // Check if video is already playing to avoid interruption
          if (!videoElement.paused) return

          await videoElement.play()
        } catch (error) {
          // Silently handle autoplay prevention - fallback to image
          console.warn("Video autoplay prevented, using fallback image")
        }
      }, 100)
    } else if (!isActive && isPlaying) {
      // Only pause if currently playing to avoid interruption errors
      timeoutId = setTimeout(() => {
        if (!videoElement.paused) {
          videoElement.pause()
        }
      }, 50)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [isActive, isVideoLoaded, hasVideoError, isPlaying])

  // Reset video to beginning when becoming active
  useEffect(() => {
    const videoElement = videoRef.current

    if (videoElement && isActive && isVideoLoaded && !hasVideoError) {
      videoElement.currentTime = 0
    }
  }, [isActive, isVideoLoaded, hasVideoError])

  const shouldShowVideo = isVideoLoaded && !hasVideoError && isActive

  return (
    <div className={`absolute inset-0 w-full h-full bg-gradient-to-r ${gradient}`}>
      {/* Fallback image - always rendered but hidden when video is playing */}
      <Image
        src={fallbackImageSrc || "/placeholder.svg"}
        width={1400}
        height={600}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          shouldShowVideo ? "opacity-0" : "opacity-100"
        }`}
        priority={isActive}
      />

      {/* Video background */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          shouldShowVideo ? "opacity-100" : "opacity-0"
        }`}
        muted
        loop
        playsInline
        preload="metadata"
        poster={fallbackImageSrc}
      >
        <source src={videoSrc} type="video/mp4" />
        <source src={videoSrc.replace(".mp4", ".webm")} type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Gradient overlay for better text readability */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-80 mix-blend-multiply`}></div>
    </div>
  )
}
