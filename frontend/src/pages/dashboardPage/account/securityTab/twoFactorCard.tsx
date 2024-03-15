import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {useFetch} from "@/hooks/useFetch.ts";
import {ApiEndpoint} from "@/Types.ts";
import {useEffect, useMemo} from "react";
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel, FormMessage,
} from "@/components/ui/form"
import {Switch} from "@/components/ui/switch"
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp.tsx";
import {Button} from "@/components/ui/button.tsx";
import TwoFactorQrCodeModal from "@/pages/dashboardPage/account/securityTab/twoFactorQrCodeModal.tsx";
import {useUser} from "@/context/userContext.tsx";

const FormSchema = z.object({
    enable: z.boolean().default(false).optional(),
    twoFactorCode: z.string().optional(),
})

type TwoFactorResponse = {
    sharedKey: string,
    recoveryCodesLeft: number,
    recoveryCodes: string[],
    isTwoFactorEnabled: boolean,
    isMachineRemembered: boolean
}

export default function TwoFactorCard() {
    const {userData} = useUser();
    const {data, doFetch} = useFetch<TwoFactorResponse>(ApiEndpoint.ManageTwoFactor, []);

    useEffect(() => {
        doFetch("POST", [], {});
    }, []);

    useEffect(() => {
        form.reset({
            enable: data?.isTwoFactorEnabled || false,
            twoFactorCode: ""
        });
    }, [data]);
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: useMemo(() => {
            return {
                enable: data?.isTwoFactorEnabled || false,
                twoFactorCode: ""
            }
        }, [data])
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        doFetch("POST", [], data);
    }


    return (
        <Card>
            <CardHeader>Two factor authentication</CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2.5">
                        <FormField
                            control={form.control}
                            name="enable"
                            render={({field}) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Enable
                                        </FormLabel>
                                        <FormDescription>
                                            Enable two factor authentication
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        {(form.watch("enable") === true) && data?.isTwoFactorEnabled === false &&
                            <div className="rounded-lg border p-4 space-y-2.5">
                                <FormField
                                    control={form.control}
                                    name="twoFactorCode"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Enter one-time code</FormLabel>
                                            <FormDescription>
                                                Scan the QR code or copy the secret to your authenticator app
                                            </FormDescription>
                                            <FormControl>
                                                <InputOTP
                                                    {...field}
                                                    autoFocus={true}
                                                    maxLength={6}
                                                    render={({slots}) => (
                                                        <>
                                                            <InputOTPGroup>
                                                                {slots.map((slot, index) => (
                                                                    <InputOTPSlot key={index} {...slot} />
                                                                ))}{" "}
                                                            </InputOTPGroup>
                                                        </>
                                                    )}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <div className="space-x-2.5 mt-2.5">
                                    <TwoFactorQrCodeModal
                                        secret={data?.sharedKey || ""}
                                        email={userData?.email || ""}
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigator.clipboard.writeText(data?.sharedKey || "")
                                        }}
                                    >Copy secret</Button>
                                </div>
                            </div>}
                        {form.formState.isDirty && <Button type="submit">Save</Button>}
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}