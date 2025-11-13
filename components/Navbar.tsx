import Image from "next/image";
import LanguageLevelSelector from "./LanguageLevelSelector";
import AyaContainer from "./AyaContainer";

const Navbar = () => {
    return (
        <nav className="w-full flex justify-center items-center">
            <div className="container mx-auto flex flex-col-reverse gap-7 lg:flex-row items-center justify-between">
                <AyaContainer />
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
