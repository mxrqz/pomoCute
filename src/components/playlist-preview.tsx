/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { useEffect, useRef } from 'react';

interface PlaylistPreview {
    id: string,
    playlistId:  string,
    isPlaylist: boolean
}

export default function PlaylistPreview({ id, playlistId, isPlaylist }: PlaylistPreview) {
    const playerRef = useRef<HTMLDivElement | null>(null);
    const youtubePlayer = useRef<any>(null);

    useEffect(() => {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

        (window as any).onYouTubeIframeAPIReady = () => {
            youtubePlayer.current = new (window as any).YT.Player(playerRef.current, {
                videoId: !isPlaylist && id,
                events: {
                    onReady: onPlayerReady,
                },
                playerVars: {
                    autoplay: 0,
                    controls: 1,
                    listType: isPlaylist ? 'playlist' : null,
                    list: isPlaylist ? playlistId : null,
                    index: 0,
                },
            });
        };

        const onPlayerReady = (event: any) => {
            if (isPlaylist) {
                event.target.cuePlaylist({
                    list: playlistId,
                    listType: 'playlist',
                    index: 0,
                    autoplay: 0
                });
            } else {
                event.target.loadVideoById(id);
            }
        };
        

        // return () => {
        //     if (youtubePlayer.current) {
        //         youtubePlayer.current.destroy();
        //     }
        // };
    }, [id, isPlaylist, playlistId]);

    return (
        <div ref={playerRef}  />
    );
}
