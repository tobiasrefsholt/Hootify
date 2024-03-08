import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";

export default function RegisterTab() {
    return (
        <>
            <form className="space-y-2.5">
                <Input placeholder="Email" inputMode="numeric"/>
                <Input placeholder="Password" type="password"/>
                <Button variant="secondary">
                    Register
                </Button>
            </form>
        </>
    )
}