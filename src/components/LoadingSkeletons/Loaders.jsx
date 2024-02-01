'use client'
import useTheme from "@/hooks/useTheme";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const getSkeletonThemeColors = (theme) => ({
    baseColor: theme === "dark" ? "#7d7d7d" : "#f4f4f4",
    highlightColor: theme === "dark" ? "#e3ebdb" : "#b2b2b2",
});

export const LoadingCards = () => {
    const { theme } = useTheme();
    const { baseColor, highlightColor } = getSkeletonThemeColors(theme);
    return (
        <div className="cardinhome p-2 m-2">
            <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
                <div className="flex gap-2 items-center">
                    <Skeleton count={1} width={45} height={45} circle />
                    <div>
                        <Skeleton count={1} width={150} height={10} />
                        <div className="flex gap-4 items-center">
                            <Skeleton count={1} width={60} height={8} />
                            <Skeleton count={1} width={30} height={8} />
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <Skeleton count={3} />
                </div>
            </SkeletonTheme>
        </div>
    );
};

export const LoadingLikers = () => {
    const { theme } = useTheme();
    const { baseColor, highlightColor } = getSkeletonThemeColors(theme);
    return (
        <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
            <div className="flex gap-2 items-center ">
                <Skeleton count={1} width={30} height={30} circle />
                <div className="flex flex-col">
                    <Skeleton count={1} width={50} height={4} />
                    <Skeleton count={1} width={20} height={4} />
                </div>
            </div>
        </SkeletonTheme>
    );
};

export const LoadingModalData = () => {
    const { theme } = useTheme();
    const { baseColor, highlightColor } = getSkeletonThemeColors(theme);
    return (
        <div className=" p-2 m-2">
            <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
                <div className="flex items-center justify-center">
                    <Skeleton count={1} width={200} height={200} />
                </div>
                <div className="mt-4">
                    <Skeleton count={3} height={9} width={200}/>
                </div>
            </SkeletonTheme>
        </div>
    );
};

export const LoadingModalUser = () => {
    const { theme } = useTheme();
    const { baseColor, highlightColor } = getSkeletonThemeColors(theme);
    return (
        <div className=" p-2 m-2">
            <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
                <div className="flex gap-2 items-center">
                    <Skeleton count={1} width={30} height={30} circle />
                    <div>
                        <Skeleton count={1} width={100} height={8} />
                        <div className="flex gap-4 items-center">
                            <Skeleton count={1} width={20} height={6} />
                            <Skeleton count={1} width={20} height={6} />
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <Skeleton count={3} height={9} width={200}/>
                </div>
            </SkeletonTheme>
        </div>
    );
};

export const LoadingNotifications = () => {
    const { theme } = useTheme();
    const { baseColor, highlightColor } = getSkeletonThemeColors(theme);
    return (
        <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
            <div className="flex gap-2 items-center min-w-[250px] max-w-full ">
                <Skeleton count={1} width={30} height={30} circle />
                <div className="flex flex-col">
                    <Skeleton count={1} width={80} height={3} />
                    <Skeleton count={1} width={30} height={3} />
                </div>
            </div>
            <div className="flex gap-2 items-center min-w-[250px] max-w-full ">
                <Skeleton count={1} width={30} height={30} circle />
                <div className="flex flex-col">
                    <Skeleton count={1} width={80} height={3} />
                    <Skeleton count={1} width={30} height={3} />
                </div>
            </div>
        </SkeletonTheme>
    );
};

export const LoadingProfile = () => {
    const { theme } = useTheme();
    const { baseColor, highlightColor } = getSkeletonThemeColors(theme);
    return (
        <div className="flex flex-col items-center justify-center p-2 m-2">
            <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
                <Skeleton count={1} width={300} height={250} />
                <Skeleton count={6} width={290} height={8} />
            </SkeletonTheme>
        </div>
    );
};