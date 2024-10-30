"use client"

import { RotateCw, SettingsIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { useState, useEffect, useRef } from "react";

interface SettingsProps {
    settings: (settings: { mediaType: "Video" | "Playlist", URL: string, autoplay: boolean | undefined, index: number }) => void
}

export default function Settings({ settings }: SettingsProps) {
    const [type, setType] = useState<"Video" | "Playlist">()
    const [URL, setURL] = useState<string>()
    const [autoplay, setAutoplay] = useState<boolean>()
    const [index, setIndex] = useState<number>(0)
    const [isValid, setIsValid] = useState<boolean>(true)

    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const musicItems = localStorage.getItem('music');
        if (!musicItems) {
            setType("Video");
            setURL("https://www.youtube.com/watch?v=jfKfPfyJRdk")
            setIndex(0)
            setAutoplay(true)

            settings({ mediaType: "Video", URL: "https://www.youtube.com/watch?v=jfKfPfyJRdk", autoplay: true, index: 0 });
            return
        }

        const { type, URL, autoplay, index } = JSON.parse(musicItems)
        setType(type)
        setURL(URL)
        setIndex(index)
        setAutoplay(autoplay)

        settings({ mediaType: type, URL, autoplay, index });
    }, [settings]);

    const save = () => {
        if (!type || !URL) return

        settings({ mediaType: type, URL, autoplay, index: 0 });

        const musicItems = { type, URL, autoplay, index };
        localStorage.setItem('music', JSON.stringify(musicItems));
    }

    const checkURL = (e: string) => {
        if (!e) {
            setIsValid(false)
            return
        }

        const videoRegex = /(?:youtube\.com\/.*(?:v=|\/v\/|\/embed\/|\/shorts\/|\/watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const playlistRegex = /[?&]list=([a-zA-Z0-9_-]+)/;

        const videoMatch = e.match(videoRegex);
        const playlistMatch = e.match(playlistRegex);

        if (videoMatch) {
            setType("Video")
            setIsValid(true)
            setURL(e)
        } else if (playlistMatch) {
            setType("Playlist")
            setIsValid(true)
            setURL(e)
        } else {
            setIsValid(false)
        }
    }

    const handleReset = () => {
        if (!inputRef.current) return

        inputRef.current.value = "https://www.youtube.com/watch?v=jfKfPfyJRdk"

        setURL("https://www.youtube.com/watch?v=jfKfPfyJRdk")
        setType("Video")
        setIsValid(true)

        const musicItems = { type: "Video", URL: "https://www.youtube.com/watch?v=jfKfPfyJRdk", autoplay: true, index: 0 };
        localStorage.setItem('music', JSON.stringify(musicItems));
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    className="group"
                    variant={"outline"}
                    size="icon"
                >
                    <SettingsIcon className="group-active:rotate-45 transition-transform" />
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Configurações</DialogTitle>
                    <DialogDescription>
                        Personalize sua experiência de Pomodoro! Defina a URL de uma música ou playlist do YouTube, escolha autoplay ativado ou desativado e selecione o índice atual da música na playlist.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col w-full gap-5">
                    {/* <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="switch" className="text-right">Tipo de mídia</Label>

                        <div className="inline-flex items-center gap-2">
                            <Switch
                                checked={type === 'Playlist'}
                                onCheckedChange={checked => checked ? setType("Playlist") : setType("Video")}
                            />
                            <span>{type}</span>
                        </div>
                    </div> */}

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="mediaType" className="text-right">
                            URL
                        </Label>

                        <div className="col-span-3 inline-flex items-center gap-4">
                            <Input className={` ${isValid ? 'border-green-500' : "border-red-500"}`}
                                ref={inputRef}
                                id="mediaType"
                                // value={URL}
                                defaultValue={URL}
                                onChange={(e) => {
                                    checkURL(e.currentTarget.value)
                                    // const value = e.currentTarget.value.trim()
                                    // if (value) {
                                    //     setURL(value)
                                    // }
                                }}
                            />

                            <RotateCw cursor={"pointer"} onClick={handleReset} />
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="mediaType" className="text-right">
                            AutoPlay
                        </Label>

                        <Switch
                            defaultChecked
                            onCheckedChange={setAutoplay}
                            checked={autoplay}
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="mediaType" className="text-right">
                            Iniciar na música nº
                        </Label>

                        <Input
                            defaultValue={"0"}
                            type="number"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant={"outline"} type="button">Fechar</Button>
                    </DialogClose>

                    <DialogClose asChild>
                        <Button type="button" onClick={save} disabled={!isValid}>Salvar</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}