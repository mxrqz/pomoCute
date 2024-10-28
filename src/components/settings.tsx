"use client"

import { SettingsIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { useState, useEffect } from "react";
// import { Checkbox } from "./ui/checkbox";

interface SettingsProps {
    settings: (settings: { mediaType: "Video" | "Playlist", URL: string, autoplay: boolean, index: number }) => void
}

export default function Settings({ settings }: SettingsProps) {
    const [type, setType] = useState<"Video" | "Playlist">()
    const [URL, setURL] = useState<string>()
    const [autoplay, setAutoplay] = useState<boolean>()
    const [index, setIndex] = useState<number>(0)

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
        if (!type || !URL || !autoplay) return

        settings({ mediaType: type, URL, autoplay, index: 0 });

        const musicItems = { type, URL, autoplay, index };
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
                    <DialogTitle></DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>

                <div className="flex flex-col w-full gap-5">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="switch" className="text-right">Tipo de mídia</Label>

                        <div className="inline-flex items-center gap-2">
                            <Switch
                                checked={type === 'Playlist'}
                                onCheckedChange={checked => checked ? setType("Playlist") : setType("Video")}
                            />
                            <span>{type}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="mediaType" className="text-right">
                            {type} URL
                        </Label>

                        <Input className="col-span-3"
                            id="mediaType"
                            value={URL}
                            onChange={(e) => {
                                const value = e.currentTarget.value.trim()
                                if (value) {
                                    setURL(value)
                                }
                            }}
                        />
                    </div>

                    {/* <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="mediaType" className="text-right">
                            AutoPlay
                        </Label>

                        <Checkbox
                            checked={autoplay ? true : false}
                            onCheckedChange={setAutoplay}
                        />
                    </div> */}
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant={"outline"} type="button">Fechar</Button>
                    </DialogClose>

                    <DialogClose asChild>
                        <Button type="button" onClick={save}>Salvar</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}