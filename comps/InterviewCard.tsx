import React from 'react'
import dayjs from "dayjs";
import Image from "next/image";
import {getRandomInterviewCover} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import TechIcons from "@/comps/TechIcons";
import {getFeedbackByInterviewId} from "@/lib/actions/general.action";


const InterviewCard = async ({id, userId, role, type, techstack, createdAt}: InterviewCardProps) => {
    const feedback = userId && id ? await getFeedbackByInterviewId({interviewId:id,userId}) : null;
    const normalizedType = /mix/gi.test(type) ? "Mixed" : type;
    const formattedDate = dayjs(createdAt).format('MMM D,YYYY');
    return (
        <div className="card-border w-90 max-sm:w-full min-h-96">
            <div className="card-interview">
                <div>
                    <div className="absolute top-0 right-0 w-fit rounded-bl-lg bg-light-600 px-4 py-2">
                        <p className="badge-text">
                            {normalizedType}
                        </p>
                    </div>
                    <Image src={getRandomInterviewCover()} width={90} height={90} alt="cover" className="rounded-full object-fit size-22.5"/>
                    <h3 className="mt-5 capitalize">{role} Interview</h3>
                    <div className="flex gap-5 mt-5">
                        <div className="flex gap-2 items-center">
                            <Image src="/calendar.svg" alt="calender" width={22} height={22} />
                            <p>{formattedDate}</p>
                        </div>
                        <div className="flex gap-2 items-center">
                            <Image src="/star.svg" alt="star" width={22} height={22} />
                            <p>
                                {feedback?.totalScore || "---" }/100
                            </p>
                        </div>
                    </div>
                    <p className="line-clamp-2 mt-5">
                        {feedback?.finalAssessment || "You haven't taken the interview yet.Take it now to improve your skills"}
                    </p>
                    <div className="flex justify-between items-center mt-5">
                        <div>
                            <TechIcons techStack={techstack}/>
                        </div>
                        <Button className="btn-primary">
                            <Link href={feedback ? `/interview/${id}/feedback` : `/interview/${id}`}>
                                {feedback ? "Check your feedback" : "Start Interview"}
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default InterviewCard
