import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {Input} from "@/components/ui/input.tsx";
import {FormEvent, useRef} from "react";
import {Button} from "@/components/ui/button.tsx";

type ChatCardProps = {
    sendChatMessage: (message: string, sender: string) => void;
};

export default function ChatCard({sendChatMessage}: ChatCardProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    function handleSend(e: FormEvent) {
        e.preventDefault();
        if (!inputRef.current) return;
        sendChatMessage(inputRef.current.value, "Admin");
        inputRef.current.value = "";
    }

    return (
        <Card>
            <CardHeader>Send a chat</CardHeader>
            <CardContent>
                <form onSubmit={handleSend} className="space-y-2.5">
                    <Input placeholder="Type your message here" ref={inputRef}/>
                    <Button variant="secondary">Send</Button>
                </form>
            </CardContent>
        </Card>
    )
}