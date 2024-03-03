import {ReactNode} from "react";

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";

type NewGameModalProps = {
    children: ReactNode;
}
export default function NewGameModal({children}: NewGameModalProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>New game</SheetTitle>
                    <SheetDescription>
                        Select a quiz and generate a new game
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input id="name" placeholder="Some creative name here" className="col-span-3"/>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Quiz
                        </Label>
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a quiz"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Fruits</SelectLabel>
                                    <SelectItem value="apple">Apple</SelectItem>
                                    <SelectItem value="banana">Banana</SelectItem>
                                    <SelectItem value="blueberry">Blueberry</SelectItem>
                                    <SelectItem value="grapes">Grapes</SelectItem>
                                    <SelectItem value="pineapple">Pineapple</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="seconds" className="text-right">
                        Seconds
                    </Label>
                    <Input type="number" id="seconds" placeholder="Seconds per question" className="col-span-3"/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4 py-5">
                    <Label className="text-right">Random order of: </Label>
                    <div>
                        <div className="flex items-center gap-2.5">
                            <Checkbox
                                id="randomizeQuestions"
                            />
                            <label className="text-right" htmlFor="randomizeQuestions">Questions</label>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <Checkbox
                                id="randomizeAnswers"
                            />
                            <label className="text-right" htmlFor="randomizeAnswers">Answers</label>
                        </div>
                    </div>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button type="submit">Submit</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}