"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */

import Script from "next/script"
import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react"
import { Label } from "./ui/label"
import { Slider } from "./ui/slider"
import { Toggle } from "./ui/toggle"
import { Progress } from "./ui/progress";

interface YtIframeProps {
    videoURL: string,
    playlist: boolean,
    autoplay: boolean,
    index: number,
    indexChange?: (playlistIndex: number) => void
}

interface MusicDetails {
    title: string,
    currentTime: number,
    duration: number,
    isLive: boolean,
    author: string
}

export default function YtIframe({ videoURL, playlist, autoplay, index }: YtIframeProps) {
    const extractYouTubeID = () => {
        const videoRegex = /(?:youtube\.com\/.*(?:v=|\/v\/|\/embed\/|\/shorts\/|\/watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const playlistRegex = /[?&]list=([a-zA-Z0-9_-]+)/;

        const videoMatch = videoURL.match(videoRegex);
        const playlistMatch = videoURL.match(playlistRegex);

        if (!videoMatch && !playlistMatch) return "jfKfPfyJRdk";

        if (playlist && playlistMatch) {
            return playlistMatch[1];
        } 
        
        if (!playlist && videoMatch) {
            return videoMatch[1];
        }

        return "jfKfPfyJRdk";
    }

    const id = extractYouTubeID()

    const playerRef = useRef<HTMLDivElement | null>(null);
    const youtubePlayer = useRef<any>(null);

    const [soundMuted, setSoundMuted] = useState<boolean>(false)
    const [volume, setVolume] = useState<number>(33)

    const [musicDetails, setMusicDetails] = useState<MusicDetails>({
        title: "Carregando...",
        currentTime: 0,
        duration: 0,
        isLive: false,
        author: "Carregando..."
    });

    const [isPaused, setIsPaused] = useState<boolean>(false)

    const hours = (currentTime: number) => {
        return Math.floor(currentTime / 3600);
    }

    const minutes = (currentTime: number) => {
        return Math.floor((currentTime % 3600) / 60);
    }

    const seconds = (currentTime: number) => {
        return Math.floor(currentTime % 60);
    }

    useEffect(() => {
        let interval: NodeJS.Timeout;

        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

        (window as any).onYouTubeIframeAPIReady = () => {
            youtubePlayer.current = new (window as any).YT.Player(playerRef.current, {
                videoId: !playlist && id,
                events: {
                    onReady: onPlayerReady,
                    onStateChange: onPlayerStateChange,
                },
                playerVars: {
                    autoplay: autoplay ? 1 : 0,
                    controls: 1,
                }
            });
        };

        const onPlayerReady = (event: any) => {
            if (playlist) {
                event.target.loadPlaylist({
                    list: id,
                    listType: 'playlist',
                    index
                });
            } else {
                event.target.loadVideoById(id);
            }

            if (soundMuted) {
                event.target.mute();
            } else {
                event.target.unMute();
            }

            event.target.setVolume(volume);
        };

        const onPlayerStateChange = (event: any) => {
            if (event.data === (window as any).YT.PlayerState.PLAYING && playlist) {
                const currentPlaylistIndex = youtubePlayer.current.getPlaylistIndex();
                saveIndex(currentPlaylistIndex)
                // indexChange(currentPlaylistIndex)
            }

            if (event.data === (window as any).YT.PlayerState.PLAYING) {
                const videoData = youtubePlayer.current.getVideoData();
                if (videoData) {
                    const { title, author, isLive } = videoData;
                    const currentTime = event.target.getCurrentTime();
                    const duration = event.target.getDuration();

                    setMusicDetails({
                        title: title || 'Título Desconhecido',
                        isLive: isLive || false,
                        currentTime: currentTime || 0,
                        duration: duration || 0,
                        author: author || 'Autor Desconhecido'
                    });

                    interval = setInterval(() => {
                        const currentTime = event.target.getCurrentTime();
                        const duration = event.target.getDuration();
                        setMusicDetails(prev => ({
                            ...prev,
                            currentTime: currentTime || 0,
                            duration: duration || 0
                        }));
                    }, 1000);
                }
            } else {
                clearInterval(interval);
            }

            if (event.data === (window as any).YT.PlayerState.PAUSED || event.data === (window as any).YT.PlayerState.ENDED) {
                clearInterval(interval); // Interromper o intervalo caso o vídeo seja pausado ou tenha terminado
            }
        };
        
        const saveIndex = (newIndex: number) => {
            const musicItems = { type: playlist ? "Playlist" : "Video", URL: videoURL, autoplay, index: newIndex };
            localStorage.setItem('music', JSON.stringify(musicItems));
        }

        // return () => {
        //     if (youtubePlayer.current) {
        //         youtubePlayer.current.destroy();
        //     }
        // };
    }, [autoplay, id, index, playlist, soundMuted, videoURL, volume]);

    useEffect(() => {
        if (!youtubePlayer.current) return;

        if (playlist) {
            youtubePlayer.current.loadPlaylist({
                list: id,
                listType: 'playlist',
            });
        } else {
            youtubePlayer.current.loadVideoById(id);
        }
    }, [id, playlist]);

    useEffect(() => {
        if (!youtubePlayer.current) return

        if (soundMuted) {
            youtubePlayer.current.mute();
        } else {
            youtubePlayer.current.unMute();
        }
    }, [soundMuted])

    useEffect(() => {
        if (!youtubePlayer.current) return

        if (isPaused) {
            youtubePlayer.current.pauseVideo()
        } else {
            youtubePlayer.current.playVideo()
        }
    }, [isPaused])

    useEffect(() => {
        if (!youtubePlayer.current) return
        youtubePlayer.current.setVolume(volume)
    }, [volume])

    return (
        <>
            <Script src="https://www.youtube.com/iframe_api" />

            <div className="flex flex-col gap-10 w-full overflow-hidden">
                <div className="flex flex-col gap-5 justify-between w-full">
                    <div className="inline-flex items-center gap-2 w-fit">
                        <Label htmlFor="volume-slider" className="flex items-center gap-2">
                            <Toggle className="p-2"
                                onClick={(e) => e.stopPropagation()}
                                onPressedChange={setSoundMuted}
                                aria-label="Toggle Sound"
                            >
                                {soundMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                            </Toggle>
                            <span className="sr-only">Volume slider</span>
                        </Label>

                        <Slider id="volume-slider" className="w-32"
                            onValueChange={(e) => setVolume(e[0])}
                            defaultValue={[33]}
                            max={100}
                            step={1}
                        />
                    </div>

                    {musicDetails && (
                        <div className="flex flex-col gap-5">
                            <div className="flex gap-5">
                                {/* <Music size={48} /> */}

                                {isPaused ? (
                                    <Play size={48} onClick={() => setIsPaused(false)} cursor={"pointer"} className="shrink-0" />
                                ) : (
                                    <Pause size={48} onClick={() => setIsPaused(true)} cursor={"pointer"} className="shrink-0" />
                                )}

                                <div className="flex flex-col">
                                    <span className="font-bold uppercase line-clamp-2">{musicDetails.title}</span>
                                    <span className="font-semibold text-muted-foreground">{musicDetails.author}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <Progress value={Math.round((musicDetails.currentTime / musicDetails.duration) * 100)} max={100} />

                                <div className="inline-flex justify-between">
                                    <div className="inline-flex">
                                        <span>{String(hours(musicDetails.currentTime)).padStart(2, '0')}</span>
                                        <span>:</span>
                                        <span>{String(minutes(musicDetails.currentTime)).padStart(2, '0')}</span>
                                        <span>:</span>
                                        <span>{String(seconds(musicDetails.currentTime)).padStart(2, '0')}</span>
                                    </div>

                                    <div className="inline-flex">
                                        {musicDetails.isLive ? (
                                            <span>LiveStream</span>
                                        ) : (
                                            <>
                                                <span>{String(hours(musicDetails.duration)).padStart(2, '0')}</span>
                                                <span>:</span>
                                                <span>{String(minutes(musicDetails.duration)).padStart(2, '0')}</span>
                                                <span>:</span>
                                                <span>{String(seconds(musicDetails.duration)).padStart(2, '0')}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-24 w-full hidden" ref={playerRef} />
            </div>
        </>
    )
}