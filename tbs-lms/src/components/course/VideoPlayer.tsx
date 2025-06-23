'use client'

import { useState, useEffect, useRef } from 'react'
import ReactPlayer from 'react-player/vimeo'
import { PlayIcon, PauseIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline'
import { cn, generateVimeoEmbedUrl, parseVimeoId } from '@/lib/utils'

interface VideoPlayerProps {
  url: string
  onProgress?: (progress: number) => void
  onEnded?: () => void
  autoPlay?: boolean
  controls?: boolean
  className?: string
  lessonId?: string
  userId?: string
}

export default function VideoPlayer({
  url,
  onProgress,
  onEnded,
  autoPlay = false,
  controls = true,
  className,
  lessonId,
  userId,
}: VideoPlayerProps) {
  const [playing, setPlaying] = useState(autoPlay)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [played, setPlayed] = useState(0)
  const [loaded, setLoaded] = useState(0)
  const [duration, setDuration] = useState(0)
  const [seeking, setSeeking] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const playerRef = useRef<ReactPlayer>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout>()

  // Parse Vimeo URL to get video ID
  const videoId = parseVimeoId(url)
  const embedUrl = videoId ? generateVimeoEmbedUrl(videoId) : url

  // Track watch time and progress
  useEffect(() => {
    if (playing && !seeking && lessonId && userId) {
      progressIntervalRef.current = setInterval(() => {
        if (playerRef.current) {
          const currentTime = playerRef.current.getCurrentTime()
          const duration = playerRef.current.getDuration()
          
          if (duration > 0) {
            const progressPercent = (currentTime / duration) * 100
            onProgress?.(progressPercent)
            
            // Save progress to backend every 10 seconds
            if (Math.floor(currentTime) % 10 === 0) {
              saveProgress(progressPercent, currentTime)
            }
          }
        }
      }, 1000)
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [playing, seeking, lessonId, userId, onProgress])

  const saveProgress = async (progressPercent: number, currentTime: number) => {
    if (!lessonId || !userId) return

    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lesson_id: lessonId,
          user_id: userId,
          progress_percentage: progressPercent,
          current_time: currentTime,
          duration,
        }),
      })
    } catch (error) {
      console.error('Error saving video progress:', error)
    }
  }

  const handlePlay = () => {
    setPlaying(true)
  }

  const handlePause = () => {
    setPlaying(false)
  }

  const handleEnded = () => {
    setPlaying(false)
    onEnded?.()
    
    // Mark lesson as completed
    if (lessonId && userId) {
      markLessonComplete()
    }
  }

  const markLessonComplete = async () => {
    try {
      await fetch('/api/lessons/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lesson_id: lessonId,
          user_id: userId,
          completed_at: new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.error('Error marking lesson complete:', error)
    }
  }

  const handleProgress = (state: any) => {
    if (!seeking) {
      setPlayed(state.played)
      setLoaded(state.loaded)
    }
  }

  const handleSeekMouseDown = () => {
    setSeeking(true)
  }

  const handleSeekChange = (value: number) => {
    setPlayed(value)
  }

  const handleSeekMouseUp = (value: number) => {
    setSeeking(false)
    playerRef.current?.seekTo(value)
  }

  const handleDuration = (duration: number) => {
    setDuration(duration)
  }

  const handleReady = () => {
    setLoading(false)
  }

  const handleError = (error: any) => {
    setError('Video failed to load. Please check your connection.')
    setLoading(false)
    console.error('Video player error:', error)
  }

  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000)
    const hh = date.getUTCHours()
    const mm = date.getUTCMinutes()
    const ss = date.getUTCSeconds().toString().padStart(2, '0')
    
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`
    }
    return `${mm}:${ss}`
  }

  if (error) {
    return (
      <div className={cn('relative bg-gray-900 rounded-lg overflow-hidden', className)}>
        <div className="aspect-video flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-red-400 mb-2">⚠️</div>
            <p className="text-sm">{error}</p>
            <button
              onClick={() => {
                setError(null)
                setLoading(true)
              }}
              className="mt-2 px-4 py-2 bg-tbs-primary text-white rounded-md hover:bg-tbs-secondary transition-colors text-sm"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative bg-gray-900 rounded-lg overflow-hidden group', className)}>
      {/* Video Player */}
      <div className="relative aspect-video">
        <ReactPlayer
          ref={playerRef}
          url={embedUrl}
          playing={playing}
          muted={muted}
          volume={volume}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onReady={handleReady}
          onError={handleError}
          width="100%"
          height="100%"
          controls={false} // Use custom controls
          config={{
            vimeo: {
              playerOptions: {
                autopause: false,
                byline: false,
                portrait: false,
                title: false,
                transparent: true,
              },
            },
          }}
        />

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {/* Custom Controls */}
        {controls && !loading && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Progress Bar */}
            <div className="mb-3">
              <div className="relative">
                <div className="w-full h-1 bg-gray-600 rounded-full">
                  <div 
                    className="h-full bg-gray-400 rounded-full"
                    style={{ width: `${loaded * 100}%` }}
                  />
                  <div 
                    className="absolute top-0 h-full bg-tbs-primary rounded-full"
                    style={{ width: `${played * 100}%` }}
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step="any"
                  value={played}
                  onMouseDown={handleSeekMouseDown}
                  onChange={(e) => handleSeekChange(parseFloat(e.target.value))}
                  onMouseUp={(e) => handleSeekMouseUp(parseFloat(e.target.value))}
                  className="absolute top-0 w-full h-1 bg-transparent appearance-none cursor-pointer"
                  style={{
                    background: 'transparent',
                  }}
                />
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {/* Play/Pause Button */}
                <button
                  onClick={() => setPlaying(!playing)}
                  className="p-2 text-white hover:text-tbs-primary transition-colors"
                >
                  {playing ? (
                    <PauseIcon className="w-6 h-6" />
                  ) : (
                    <PlayIcon className="w-6 h-6" />
                  )}
                </button>

                {/* Volume Control */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setMuted(!muted)}
                    className="text-white hover:text-tbs-primary transition-colors"
                  >
                    {muted ? (
                      <SpeakerXMarkIcon className="w-5 h-5" />
                    ) : (
                      <SpeakerWaveIcon className="w-5 h-5" />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step="any"
                    value={muted ? 0 : volume}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value)
                      setVolume(value)
                      setMuted(value === 0)
                    }}
                    className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Time Display */}
                <div className="text-white text-sm">
                  {formatTime(duration * played)} / {formatTime(duration)}
                </div>
              </div>

              {/* Settings */}
              <div className="flex items-center space-x-2">
                {/* Playback Speed */}
                <select
                  value={1}
                  onChange={(e) => {
                    // Implement playback speed control
                    console.log('Playback speed:', e.target.value)
                  }}
                  className="bg-transparent text-white text-sm border border-gray-600 rounded px-2 py-1"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={0.75}>0.75x</option>
                  <option value={1}>1x</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x</option>
                </select>

                {/* Fullscreen Button */}
                <button
                  onClick={() => {
                    if (playerRef.current) {
                      const playerElement = playerRef.current.getInternalPlayer()
                      if (playerElement?.requestFullscreen) {
                        playerElement.requestFullscreen()
                      }
                    }
                  }}
                  className="text-white hover:text-tbs-primary transition-colors text-sm"
                >
                  ⛶
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Information */}
      {lessonId && (
        <div className="p-4 bg-white border-t">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Tiến độ: {Math.round(played * 100)}%</span>
            <span>Thời lượng: {formatTime(duration)}</span>
          </div>
        </div>
      )}
    </div>
  )
} 