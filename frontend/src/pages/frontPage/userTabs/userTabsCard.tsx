import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {useState} from "react";
import RegisterTab from "@/pages/frontPage/userTabs/registerTab.tsx";
import LoginTab from "@/pages/frontPage/userTabs/loginTab.tsx";
import LoggedInTab from "@/pages/frontPage/userTabs/loggedInTab.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {useUser} from "@/context/userContext.tsx";
import ForgotPasswordTab from "@/pages/frontPage/userTabs/forgotPasswordTab.tsx";

export function UserTabsCard() {
    const {responseCode: loginResponse} = useUser();
    const [tab, setTab] = useState("register");
    return (
        <Card className="w-full sm:w-80">
            <CardHeader>
                <CardTitle>Access dashboard</CardTitle>
                <CardDescription>Create a new account or log in to host your own quiz!</CardDescription>
            </CardHeader>
            <CardContent>
                {loginResponse === 200
                    ?
                    <LoggedInTab/>
                    :
                    <Tabs value={tab} onValueChange={setTab} className="">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="register">Register</TabsTrigger>
                            <TabsTrigger value="login">Login</TabsTrigger>
                        </TabsList>
                        <TabsContent value="register">
                            <RegisterTab/>
                        </TabsContent>
                        <TabsContent value="login">
                            <LoginTab setTab={setTab}/>
                        </TabsContent>
                        <TabsContent value="loggedin">
                            <LoggedInTab/>
                        </TabsContent>
                        <TabsContent value="forgotPassword">
                            <ForgotPasswordTab/>
                        </TabsContent>
                    </Tabs>
                }
            </CardContent>
        </Card>
    )
}
