import { ReactNode } from "react";
import CategoryHomeBtn from "./_components/CategoryHomeBtn";
import { PiMapTrifoldLight } from "react-icons/pi";
import { BsTranslate } from "react-icons/bs";
import { LiaIdBadgeSolid } from "react-icons/lia";
import { FaToolbox } from "react-icons/fa";
import { FaRegLightbulb } from "react-icons/fa";
import { CiWarning } from "react-icons/ci";
import { ImBooks } from "react-icons/im";
import { FaMoneyBills } from "react-icons/fa6";
import Navbar from "./_components/Navbar";
type Props = {
    title: string;
    description: string;
    answers: number;
    icon: ReactNode;
    theme: {
        bg: string;
        text: string;
    };
    path: string;
};

const data: Props[] = [
    {
        title: "Getting Started",
        description: "Learn about how to make things",
        answers: 24,
        icon: <PiMapTrifoldLight style={{ color: "#035444" }} size={25} />,
        theme: {
            bg: "#06977B",
            text: "#035444",
        },
        path: "/starting",
    },
    {
        title: "Definitions",
        description: "Learn about how to make things",
        answers: 27,
        icon: <BsTranslate style={{ color: "#192278" }} size={25} />,
        theme: {
            bg: "#1E2EBC80",
            text: "#192278",
        },
        path: "/definitions",
    },
    {
        title: "Career Path",
        description: "Learn about how to make things",
        answers: 23,
        icon: <LiaIdBadgeSolid style={{ color: "#581D70" }} size={35} />,
        theme: {
            bg: "#A03EC8",
            text: "#581D70",
        },
        path: "/career",
    },
    {
        title: "Tools",
        description: "Learn about how to make things",
        answers: 11,
        icon: <FaToolbox style={{ color: "#5E0535" }} size={25} />,
        theme: {
            bg: "#D22985",
            text: "#5E0535",
        },
        path: "/tools",
    },
    {
        title: "Learning",
        description: "Learn about how to make things",
        answers: 27,
        icon: <FaRegLightbulb style={{ color: "#553004" }} size={25} />,
        theme: {
            bg: "#CE6F00",
            text: "#553004",
        },
        path: "/learning",
    },
    {
        title: "Challenges",
        description: "Learn about how to make things",
        answers: 34,
        icon: <CiWarning style={{ color: "#770B05" }} size={25} />,
        theme: {
            bg: "#D61E14",
            text: "#770B05",
        },
        path: "/challenges",
    },
    {
        title: "Resources",
        description: "Learn about how to make things",
        answers: 11,
        icon: <ImBooks style={{ color: "#474000" }} size={25} />,
        theme: {
            bg: "#867E32",
            text: "#474000",
        },
        path: "/resources",
    },
    {
        title: "Finances",
        description: "Learn about how to make things",
        answers: 19,
        icon: <FaMoneyBills style={{ color: "#004B0D" }} size={25} />,
        theme: {
            bg: "#108B25",
            text: "#004B0D",
        },
        path: "/finances",
    },
];

export default function page() {
    return (
        <>
            <Navbar />
            <div className="flex flex-col gap-4 ">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
                    {data.map(
                        ({
                            title,
                            description,
                            answers,
                            icon,
                            theme,
                            path,
                        }) => (
                            <CategoryHomeBtn
                                icon={icon}
                                key={title}
                                title={title}
                                description={description}
                                answers={answers}
                                theme={theme}
                                path={path}
                            />
                        )
                    )}
                </div>
                <div className="rounded-md p-4 border-[1px] border-black flex flex-col gap-1">
                    <h1 className="text-2xl font-bold">Side Note :</h1>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Maxime possimus asperiores aperiam excepturi, fuga sunt.
                    </p>
                </div>
            </div>
        </>
    );
}
