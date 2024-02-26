import { useEffect, useState } from "react";

export enum ApiEndpoint {
    Register = "/register",
    Login = "/login?useCookies=true",
    Refresh = "/refresh",
    ConfirmEmail = "/confirmEmail",
    ResendConfirmationEmail = "/resendConfirmationEmail",
    ForgotPassword = "/forgotPassword",
    ResetPassword = "/resetPassword",
    ManageTwoFactor = "/manage/2fa",
    ManageInfo = "/manage/info",
    JoinGame = "/game/join",
}

export function useFetch<fetchResponse>(apiEndpoint: ApiEndpoint, deps: React.DependencyList | undefined, fetchError: string | null = null) {
    const [error, setError] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [data, setData] = useState<fetchResponse | null>(null);

    useEffect(() => {
        setError(null);
        setIsPending(false);
        setData(null);
    }, deps)

    const doFetch = (
        fetchMethod: "GET" | "POST",
        urlParameters: string[] = [],
        requestBody: object | null = null,
        callback: () => void | undefined = () => { }
    ) => {
        const path = import.meta.env.VITE_BACKEND_URL + apiEndpoint + urlParameters.map((part) => "/" + part).join("");
        setIsPending(true);
        fetch(path, {
            method: fetchMethod,
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: requestBody !== null ? JSON.stringify(requestBody) : undefined
        })
            .then((res) => {
                const contentType = res.headers.get("content-type");
                const isJsonResponse = contentType && (
                    (contentType.indexOf("application/json") !== -1) ||
                    (contentType.indexOf("application/problem+json") !== -1)
                );

                if (!res.ok && isJsonResponse) {
                    console.log("Response is in JSON");
                    return res.json().then((errorData) => {
                        throw errorData;
                    });
                }

                if (!res.ok && !isJsonResponse) {
                    console.log("Response is in Text");
                    return res.text().then((errorData) => {
                        throw errorData;
                    });
                }

                if (isJsonResponse)
                    return res.json();

                return true;
            })
            .then((data: fetchResponse) => {
                setError(null);
                setIsPending(false);
                setData(data);
                console.log(data);
            })
            .catch(error => {
                setError(fetchError || "Could not fetch resource");
                setIsPending(false);
                setData(error);
                console.log(error);
            })
            .finally(() => callback())
    }

    return { error, isPending, data, doFetch };
}