import { useCallback, useEffect, useRef, useState } from 'react'

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [activeAudioAsset, setActiveAudioAsset] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const loadAudio = useCallback((audioAsset: string, autoplay: boolean) => {
    const audio = audioRef.current
    if (!audio) return

    setActiveAudioAsset(audioAsset)
    setCurrentTime(0)
    audio.src = audioAsset
    audio.load()

    if (autoplay) {
      void audio.play().catch(() => setIsPlaying(false))
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }, [])

  useEffect(() => {
    const audio = new Audio()
    audioRef.current = audio

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onLoadedMetadata = () => setDuration(audio.duration)
    const onEnded = () => setIsPlaying(false)
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    return () => {
      audio.pause()
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audioRef.current = null
    }
  }, [])

  const playAudio = useCallback(
    (audioAsset: string) => {
      loadAudio(audioAsset, true)
    },
    [loadAudio],
  )

  const togglePlay = useCallback(
    (audioAsset: string) => {
      const audio = audioRef.current
      if (!audio) return

      if (activeAudioAsset !== audioAsset || !audio.src) {
        loadAudio(audioAsset, true)
        return
      }

      if (audio.paused) {
        void audio.play().catch(() => setIsPlaying(false))
      } else {
        audio.pause()
      }
    },
    [activeAudioAsset, loadAudio],
  )

  const seek = useCallback((time: number) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(time)) return
    audio.currentTime = time
    setCurrentTime(time)
  }, [])

  const setMuted = useCallback((muted: boolean) => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = muted
  }, [])

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return {
    activeAudioAsset,
    isPlaying,
    currentTime,
    duration,
    progress,
    playAudio,
    loadAudio,
    togglePlay,
    seek,
    setMuted,
    formatTime,
  }
}
