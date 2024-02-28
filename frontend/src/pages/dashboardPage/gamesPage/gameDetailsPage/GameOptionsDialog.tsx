import {GameOptions} from "@/Types.ts";
import {Button} from "@/components/ui/button.tsx";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useState} from "react";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {CheckedState} from "@radix-ui/react-checkbox";

type SettingsDialogProps = {
    gameOptions: GameOptions | null
    onChange: (gameOptions: GameOptions) => void
}

export default function GameOptionsDialog({gameOptions, onChange}: SettingsDialogProps) {
    const [title, setTitle] = useState(gameOptions?.title);
    const [randomizeQuestions, setRandomizeQuestions] = useState<CheckedState>(gameOptions?.randomizeQuestions || 'indeterminate');
    const [randomizeAnswers, setRandomizeAnswers] = useState<CheckedState>(gameOptions?.randomizeAnswers || 'indeterminate');
    const [secondsPerQuestion, setSecondsPerQuestion] = useState(gameOptions?.secondsPerQuestion);

    function handleSave() {
        if (gameOptions === null) return;
        onChange(
            {
                quizId: gameOptions.quizId,
                title: title || gameOptions.title,
                randomizeQuestions: randomizeQuestions === 'indeterminate' ? gameOptions.randomizeQuestions : randomizeQuestions,
                randomizeAnswers: randomizeAnswers === 'indeterminate' ? gameOptions.randomizeAnswers : randomizeAnswers,
                secondsPerQuestion: secondsPerQuestion || gameOptions.secondsPerQuestion
            }
        );
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary">Game settings</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit game settings</DialogTitle>
                    <DialogDescription>
                        These settings will be applied to the game immediately. Changing the title will not affect the share key.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-2.5">
                    <div className="grid grid-cols-2 items-center gap-5">
                        <label className="text-right" htmlFor="title">Title</label>
                        <Input
                            id="title"
                            type="text"
                            defaultValue={gameOptions?.title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 items-center gap-5">
                        <label className="text-right" htmlFor="secondsPerQuestion">Seconds per question</label>
                        <Input
                            id="secondsPerQuestion"
                            type="number"
                            defaultValue={gameOptions?.secondsPerQuestion}
                            onChange={(e) => setSecondsPerQuestion(e.target.valueAsNumber)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        <p className="text-right">Random order of: </p>
                        <div>
                            <div className="flex items-center gap-2.5">
                                <Checkbox
                                    id="randomizeQuestions"
                                    defaultChecked={gameOptions?.randomizeQuestions}
                                    onCheckedChange={(isChecked) => setRandomizeQuestions(isChecked)}
                                />
                                <label className="text-right" htmlFor="randomizeQuestions">Questions</label>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Checkbox
                                    id="randomizeAnswers"
                                    defaultChecked={gameOptions?.randomizeAnswers}
                                    onCheckedChange={(isChecked) => setRandomizeAnswers(isChecked)}
                                />
                                <label className="text-right" htmlFor="randomizeAnswers">Answers</label>
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button variant="default" onClick={handleSave}>Save</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}