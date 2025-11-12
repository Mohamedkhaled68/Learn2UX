import Image from "next/image";
import LanguageLevelSelector from "./LanguageLevelSelector";

const Navbar = () => {
    return (
        <nav className="w-full flex justify-center items-center">
            <div className="container mx-auto flex flex-col-reverse gap-7 lg:flex-row items-center justify-between">
                <div
                    style={{
                        direction: "rtl",
                        fontFamily: "Traditional Arabic",
                        fontSize: "24px",
                        textAlign: "center",
                    }}
                >
                    <p className="text-[16px] lg:text-[25px] 2xl:text-[30px] text-[#363636]">
                        ﴿ ٱقْرَأْ بِٱسْمِ رَبِّكَ ٱلَّذِى خَلَقَ{" "}
                        <span className="text-[14px] lg:text-[20px]">◆</span> خَلَقَ
                        ٱلْإِنسَٰنَ مِنْ عَلَقٍ{" "}
                        <span className="text-[14px] lg:text-[20px]">◆</span> ٱقْرَأْ وَرَبُّكَ
                        ٱلْأَكْرَمُ <span className="text-[14px] lg:text-[20px]">◆</span>{" "}
                        ٱلَّذِى عَلَّمَ بِٱلْقَلَمِ{" "}
                        <span className="text-[14px] lg:text-[20px]">◆</span> عَلَّمَ
                        ٱلْإِنسَٰنَ مَا لَمْ يَعْلَمْ ﴾
                    </p>
                </div>
                <div className="flex gap-4 items-center w-full justify-between lg:w-fit px-2">
                    <Image
                        src="/STORE.png"
                        alt="Description"
                        width={85}
                        height={100}
                        className="drop-shadow-md"
                    />
                    <LanguageLevelSelector />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
