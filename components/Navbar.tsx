import LanguageLevelSelector from "./LanguageLevelSelector";

const Navbar = () => {
    return (
        <nav className="w-full h-[100px] flex justify-center items-center">
            <div className="container mx-auto flex items-center justify-between">
                <LanguageLevelSelector />
                <div
                    style={{
                        direction: "rtl",
                        fontFamily: "Traditional Arabic",
                        fontSize: "24px",
                        textAlign: "center",
                    }}
                >
                    <p className="">
                        ﴿ ٱقْرَأْ بِٱسْمِ رَبِّكَ ٱلَّذِى خَلَقَ <span className="text-[20px]">◆</span> خَلَقَ
                        ٱلْإِنسَٰنَ مِنْ عَلَقٍ{" "}
                        <span className="text-[20px]">◆</span> ٱقْرَأْ
                        وَرَبُّكَ ٱلْأَكْرَمُ{" "}
                        <span className="text-[20px]">◆</span> ٱلَّذِى
                        عَلَّمَ بِٱلْقَلَمِ{" "}
                        <span className="text-[20px]">◆</span> عَلَّمَ
                        ٱلْإِنسَٰنَ مَا لَمْ يَعْلَمْ ﴾
                    </p>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
