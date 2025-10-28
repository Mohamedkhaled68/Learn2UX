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
                    <p>
                        ﴿ ٱقْرَأْ بِٱسْمِ رَبِّكَ ٱلَّذِى خَلَقَ &#x1F539;
                        خَلَقَ ٱلْإِنسَٰنَ مِنْ عَلَقٍ &#x1F539; ٱقْرَأْ
                        وَرَبُّكَ ٱلْأَكْرَمُ &#x1F539; ٱلَّذِى عَلَّمَ
                        بِٱلْقَلَمِ &#x1F539; عَلَّمَ ٱلْإِنسَٰنَ مَا لَمْ
                        يَعْلَمْ ﴾
                    </p>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
