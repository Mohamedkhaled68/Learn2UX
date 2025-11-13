import React from "react";
import { TailSpin } from "react-loader-spinner";

interface SpinnerProps {
    color?: string;
    width?: string | number;
    height?: string | number;
}

const Spinner = ({
    color = "#363636",
    width = "80",
    height = "80",
}: SpinnerProps) => {
    return (
        <TailSpin
            visible={true}
            height={height}
            width={width}
            color={color}
            ariaLabel="tail-spin-loading"
            radius="1"
        />
    );
};

export default Spinner;
