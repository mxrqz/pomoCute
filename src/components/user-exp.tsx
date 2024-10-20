import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Progress } from "./ui/progress";

const currentLevel = 4
const currentXp = 10
const xpToNextLevel = Math.floor(100 * Math.pow(1.2, currentLevel - 1))

export default function UserExp() {



    return (
        <Popover>
            <PopoverTrigger className="inline-flex max-h-9 h-9 gap-3 items-center cursor-pointer border rounded-md px-2 hover:bg-accent group transition-colors relative">
                <div className="size-6 aspect-square rounded-full bg-foreground inline-flex items-center justify-center">
                    <span className="text-background">U</span>
                </div>

                <div className="flex flex-col h-full place-items-center">
                    <span className="font-semibold text-">Level {currentLevel}</span>

                    <Progress value={currentXp} max={xpToNextLevel} className="h-1" />
                </div>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-fit">
                <span>Current Xp: {currentXp} / {xpToNextLevel}</span>
            </PopoverContent>

            {/* <div className="absolute size-3 top-0 right-0 translate-x-1/2 -translate-y-1/2  flex items-center justify-center">
                <span className="text-xs font-semibold">x1</span>
            </div> */}
        </Popover>
    )
}