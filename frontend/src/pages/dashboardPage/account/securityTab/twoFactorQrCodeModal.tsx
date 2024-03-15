import {Button} from "@/components/ui/button"
import {
    Dialog, DialogClose,
    DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {QRCodeSVG} from 'qrcode.react';

type TwoFactorQrCodeModalProps = {
    secret: string,
    email: string
}

export default function TwoFactorQrCodeModal({secret, email}: TwoFactorQrCodeModalProps) {
    const qrCodeUrl = `otpauth://totp/Hootify:${email}?secret=${secret}&issuer=Hootify`;
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary">Show QR-code</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Scan qr code</DialogTitle>
                    <DialogDescription>
                        Scan the QR code with your authenticator app
                    </DialogDescription>
                </DialogHeader>
                <QRCodeSVG
                    className="w-full max-w-60 h-auto mx-auto"
                    value={qrCodeUrl}
                />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button>Done</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}