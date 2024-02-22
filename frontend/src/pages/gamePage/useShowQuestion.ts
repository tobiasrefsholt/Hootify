import {Question} from "@/Types.ts";
import {useEffect, useState} from "react";

type useShowQuestionProps = {
    question: Question | null
}

export default function useShowQuestion({question}: useShowQuestionProps) {

    const [progressPercentage, setProgressPercentage] = useState(0);

    useEffect(() => {
        function calculateProgressPercentage(): number {
            if (!question?.id) return 0;
            const {seconds, startTime} = question;
            const now = new Date().getTime();
            const startDate = new Date(startTime).getTime();
            const endDate = startDate + seconds * 1000;
            const progress = (now - startDate) / (endDate - startDate);
            return Math.max(0, Math.min(1, progress)) * 100;
        }

        const progressInterval = setInterval(() => {
            setProgressPercentage(calculateProgressPercentage());
        }, 500);

        return () => clearInterval(progressInterval);
    }, [question]);

    return {progressPercentage}
}