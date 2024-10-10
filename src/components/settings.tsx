"use client"

import { SettingsIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { useEffect, useState } from "react";
import { Checkbox } from "./ui/checkbox";

interface SettingsProps {
    type: "Video" | "Playlist",
    link: string,
    play: boolean
    settings: (settings: { mediaType: "Video" | "Playlist", URL: string, autoplay: boolean }) => void
}

export default function Settings({ type, link, play, settings }: SettingsProps) {
    const [mediaType, setMediaType] = useState<"Video" | "Playlist">(type)
    const [URL, setURL] = useState<string>(link)
    const [autoplay, setAutoplay] = useState<boolean | string>(play)

    useEffect(() => {
        const auto = autoplay ? true : false
        settings({ mediaType, URL, autoplay: auto });
    }, [mediaType, URL, autoplay, settings]);

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
                            <Switch onCheckedChange={checked => checked ? setMediaType("Playlist") : setMediaType("Video")} />
                            <span>{mediaType}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="mediaType" className="text-right">
                            {mediaType} URL
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

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="mediaType" className="text-right">
                            AutoPlay
                        </Label>

                        <Checkbox
                            checked={autoplay ? true : false}
                            onCheckedChange={setAutoplay}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}