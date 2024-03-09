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

export function UserTabsCard() {
    const {userData} = useUser();
    const [tab, setTab] = useState("register");
    return (
        <Card className="w-full sm:w-80">
            <CardHeader>
                <CardTitle>Access dashboard</CardTitle>
                <CardDescription>Create a new account or log in to host your own quiz!</CardDescription>
            </CardHeader>
            <CardContent>
                {userData === null
                    ?
                    <Tabs value={tab} onValueChange={setTab} className="">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="register">Register</TabsTrigger>
                            <TabsTrigger value="login">Login</TabsTrigger>
                        </TabsList>
                        <TabsContent value="register">
                            <RegisterTab/>
                        </TabsContent>
                        <TabsContent value="login">
                            <LoginTab/>
                        </TabsContent>
                        <TabsContent value="loggedin">
                            <LoggedInTab/>
                        </TabsContent>
                    </Tabs>
                    :
                    <LoggedInTab/>
                }
            </CardContent>
        </Card>
    )
}