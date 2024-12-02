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
}

interface MusicDetails {
    title: string,
    currentTime: number,
    duration: number,
    isLive: boolean,
    author: string
}

export default function YtIframe({ videoURL }: YtIframeProps) {
    const extractYouTubeID = () => {
        const videoRegex = /(?:youtube\.com\/.*(?:v=|\/v\/|\/embed\/|\/shorts\/|\/watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        // const playlistRegex = /[?&]list=([a-zA-Z0-9_-]+)/;

        const videoMatch = videoURL.match(videoRegex);
        // const playlistMatch = videoURL.match(playlistRegex);

        if (videoMatch) {
            return videoMatch[1]
        }
        return "jfKfPfyJRdk";
    }

    const id = extractYouTubeID()

    const playerRef = useRef<HTMLDivElement | null>(null);
    const youtubePlayer = useRef<any>(null);

    const [soundMuted, setSoundMuted] = useState<boolean>(false)
    const [volume, setVolume] = useState<number>(33)

    const [musicDetails, setMusicDetails] = useState<MusicDetails>({
        title: "Pressione Play para iniciar",
        currentTime: 0,
        duration: 0,
        isLive: false,
        author: ""
    });

    const [isPaused, setIsPaused] = useState<boolean>(true)

    const hours = (currentTime: number) => {
        return Math.floor(currentTime / 3600);
    }

    const minutes = (currentTime: number) => {
        return Math.floor((currentTime % 3600) / 60);
    }

    const seconds = (currentTime: number) => {
        return Math.floor(currentTime % 60);
    }

    const play = () => {
        if (!youtubePlayer.current) return
        youtubePlayer.current.playVideo()

        setIsPaused(false)
    }

    const pause = () => {
        if (!youtubePlayer.current) return
        youtubePlayer.current.pauseVideo()

        setIsPaused(true)
    }

    useEffect(() => {
        let interval: NodeJS.Timeout;

        (window as any).onYouTubeIframeAPIReady = () => {
            youtubePlayer.current = new (window as any).YT.Player(playerRef.current, {
                videoId: id,
                events: {
                    onReady: onPlayerReady,
                    onStateChange: onPlayerStateChange,
                },
                playerVars: {
                    controls: 0,
                    rel: 0,
                    disablekb: 1,
                    enablejsapi: 1
                }
            });
        };

        const onPlayerReady = (event: any) => {
            event.target.cueVideoById(id);

            event.target.setVolume(volume);
        };

        const onPlayerStateChange = (event: any) => {
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
                clearInterval(interval);
            }
        };

        // return () => {
        //     if (youtubePlayer.current) {
        //         youtubePlayer.current.destroy();
        //     }
        // };
    }, [id, volume]);

    return (
        <>
            <Script
                src="https://www.youtube.com/iframe_api"
                strategy="lazyOnload"
            />

            {musicDetails && (
                <div className="flex flex-col gap-1 w-full">
                    <div className="inline-flex items-start">
                        <div className="flex gap-5 w-full">
                            {/* <Music size={48} /> */}

                            {isPaused ? (
                                <Play size={48} onClick={play} cursor={"pointer"} className="shrink-0" />
                            ) : (
                                <Pause size={48} onClick={pause} cursor={"pointer"} className="shrink-0" />
                            )}

                            <div className="flex flex-col">
                                <span className="font-bold line-clamp-2">{musicDetails.title}</span>
                                <span className="font-semibold text-muted-foreground line-clamp-1">{musicDetails.author}</span>
                            </div>
                        </div>

                        <div className="w-[130px] h-[75px] rounded-md hidden" ref={playerRef} />

                        <div className="inline-flex items-center gap-2 w-fit">
                            <Label htmlFor="Volume" className="flex items-center gap-2">
                                <Toggle className="p-2"
                                    onClick={(e) => e.stopPropagation()}
                                    onPressedChange={(e) => {
                                        setSoundMuted(e);
                                        if (e) {
                                            youtubePlayer.current.mute()
                                        } else {
                                            youtubePlayer.current.unMute()
                                        }
                                    }}
                                    aria-label="Silenciar música de fundo"
                                >
                                    {soundMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                                </Toggle>
                                <span className="sr-only">Botão para silenciar a música</span>
                            </Label>

                            <Slider id="Volume" className="w-16 md:w-32"
                                aria-label="Barra de volume da música"
                                onValueChange={(e) => { setVolume(e[0]); youtubePlayer.current.setVolume(e[0]) }}
                                defaultValue={[33]}
                                max={100}
                                step={1}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <Progress value={Math.round((musicDetails.currentTime / musicDetails.duration) * 100)} max={100} aria-label="Barra de progresso da música de fundo" />

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
        </>
    )
}