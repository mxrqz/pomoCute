import { Star, Zap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { UserComponent } from "@/types/types";
import { Progress } from "./ui/progress";

export default function UserExp({ profile, currentLevel, currentXp, xpToNextLevel }: UserComponent) {

    return (
        <div>
            <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={profile?.image} alt={profile?.name} />
                    <AvatarFallback>{profile?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="font-semibold text-lg">{profile?.name}</h3>
                    <div className="flex items-center text-muted-foreground">
                        <Star className="w-4 h-4 mr-1" />
                        <span>Nível {currentLevel}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span>Progresso de XP</span>
                    <span>{currentXp} / {xpToNextLevel}</span>
                </div>

                <Progress value={(currentXp / xpToNextLevel) * 100} className="h-2" />

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Próximo nível em {xpToNextLevel - currentXp} XP</span>
                    <div className="flex items-center">
                        <Zap className="w-4 h-4 mr-1" />
                        <span>{Math.round((currentXp / xpToNextLevel) * 100)}%</span>
                    </div>
                </div>
            </div>
        </div>
    )
}