"use client";

export function UserProfileImage({ id, hasImage, styles }: { id: number, hasImage: boolean, styles?: string }) {
    return (
        <>
            {hasImage ? (
                <img
                    src={`/user-profile-images/${id}.jpg`} width={480} height={479} alt={id.toString()} draggable={false}
                    className={`rounded-full select-none ${styles ? styles : "size-10"}`}
                />
            ) : (
                <div className={`bg-primary-600 rounded-full relative overflow-hidden ${styles ? styles : "size-10"}`}>
                    <div className="size-[35%] rounded-full bg-primary-100 absolute left-1/2 bottom-1/2 transform -translate-x-1/2 translate-y-[30%]"></div>
                    <div className="w-[80%] h-[80%] rounded-full bg-primary-100 absolute left-1/2 -bottom-1/2 transform -translate-x-1/2"></div>
                </div>
            )}
        </>
    );
}