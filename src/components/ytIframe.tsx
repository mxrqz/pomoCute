/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import Script from "next/script"
import { useEffect, useRef } from "react";

interface YtIframeProps {
    id: string,
    playlist: boolean,
    playlistId: string,
    className: string,
    isSoundMuted: boolean,
    volume: number,
    autoplay: boolean
}

export default function YtIframe({ id, playlistId, playlist, className, isSoundMuted, volume, autoplay }: YtIframeProps) {
    const playerRef = useRef<HTMLDivElement | null>(null);
    const youtubePlayer = useRef<any>(null);

    useEffect(() => {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

        (window as any).onYouTubeIframeAPIReady = () => {
            youtubePlayer.current = new (window as any).YT.Player(playerRef.current, {
                videoId: playlist ? null : id,
                events: {
                    onReady: onPlayerReady,
                    // onStateChange: onPlayerStateChange,
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
                    list: playlistId,
                    listType: 'playlist',
                });
            }
        };

        return () => {
            if (youtubePlayer.current) {
                youtubePlayer.current.destroy();
            }
        };
    }, [autoplay, id, playlist, playlistId]);

    useEffect(() => {
        if (!youtubePlayer.current) return

        if (isSoundMuted) {
            youtubePlayer.current.mute();
        } else {
            youtubePlayer.current.unMute();
        }
    }, [isSoundMuted])

    useEffect(() => {
        if (!youtubePlayer.current) return
        youtubePlayer.current.setVolume(volume)
    }, [volume])

    // const pauseVideo = () => {
    //     if (youtubePlayer.current) {
    //         youtubePlayer.current.mute();
    //     }
    // };

    // const unmuteVideo = () => {
    //     if (youtubePlayer.current) {
    //         youtubePlayer.current.unMute();
    //     }
    // };

    return (
        <>
            <div
                className={className}
                ref={playerRef}
            />

            <Script src="https://www.youtube.com/iframe_api" />
        </>
    )
}