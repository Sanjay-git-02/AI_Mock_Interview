import React from 'react'
import {getInterviewById} from "@/lib/actions/general.action";
import {redirect} from "next/navigation";
import Image from "next/image";
import {getRandomInterviewCover} from "@/lib/utils";
import TechIcons from "@/comps/TechIcons";
import Agent from "@/comps/Agent";
import {getCurrentUser} from "@/lib/actions/auth.action";

const Page = async ({params}:RouteParams) => {
    const { id } = await params;
    const user = await getCurrentUser();
    const interview = await getInterviewById(id);

    if(!interview) redirect("/")

    return (
        <>
            <div className="flex flex-row justify-between gap-4">
                <div className="flex flex-row items-center gap-4 max-sm:flex-col">
                    <div className="flex items-center gap-4">
                        <Image src={getRandomInterviewCover()} alt="cover" className="rounded-full object-cover" />
                        <h3 className="capitalize">{interview.role}</h3>
                    </div>
                    <TechIcons techStack={interview.techstack}/>
                </div>
                <p className="rounded-lg bg-black-200 px-4 py-2 h-fit capitalize">
                    {interview.type}
                </p>
            </div>
            
            <Agent
                userName={user?.name}
                userId={user?.id} />
                interviewId={id}
                type="interview"
                questions={interview.questions}
        </>
    )
}
export default Page
