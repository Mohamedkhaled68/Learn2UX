import Image from "next/image";
import LanguageLevelSelector from "./LanguageLevelSelector";

const Navbar = () => {
    return (
        <nav className="w-full 2xl:h-[150px] flex justify-center items-center">
            <div className="container mx-auto flex flex-col gap-3 lg:flex-row items-center justify-between">
                <div className="flex gap-4 items-center">
                    <LanguageLevelSelector />
                    {/* <Image
                        src="/STORE.svg"
                        alt="Description"
                        width={85}
                        height={100}
                        className="drop-shadow-md"
                    /> */}
                </div>
                <div
                    style={{
                        direction: "rtl",
                        fontFamily: "Traditional Arabic",
                        fontSize: "24px",
                        textAlign: "center",
                    }}
                >
                    <p className="2xl:text-[40px]">
                        ﴿ ٱقْرَأْ بِٱسْمِ رَبِّكَ ٱلَّذِى خَلَقَ{" "}
                        <span className="text-[20px]">◆</span> خَلَقَ
                        ٱلْإِنسَٰنَ مِنْ عَلَقٍ{" "}
                        <span className="text-[20px]">◆</span> ٱقْرَأْ وَرَبُّكَ
                        ٱلْأَكْرَمُ <span className="text-[20px]">◆</span>{" "}
                        ٱلَّذِى عَلَّمَ بِٱلْقَلَمِ{" "}
                        <span className="text-[20px]">◆</span> عَلَّمَ
                        ٱلْإِنسَٰنَ مَا لَمْ يَعْلَمْ ﴾
                    </p>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
