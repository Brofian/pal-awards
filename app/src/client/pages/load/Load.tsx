import "./loading.css";

export default function Load() {
    return (
        <div className={"h-dvh w-dvw flex justify-center items-center"}>
            <span className={"loading-spinner"}></span>
        </div>
    );
}