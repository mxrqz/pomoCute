import { Textarea } from "./ui/textarea";

export default function QuickNotes() {

    return (
        <div className="w-full h-full flex flex-col gap-10 items-center p-0">
            <h3 className="text-3xl font-semibold">Notas Rápidas</h3>

            <div className="w-full h-full max-h-full flex flex-col gap-2 justify-between">
                <Textarea placeholder="Notas Rápidas" className="focus-visible:border-ring focus-visible:ring-0 h-full" />
            </div>
        </div>
    )
}