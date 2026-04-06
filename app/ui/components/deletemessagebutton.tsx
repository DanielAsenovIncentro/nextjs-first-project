import { deleteDM } from "@/app/lib/action";
import { DeleteIcon } from "./icons";
import { usePathname } from "next/navigation";

export function DeleteMessageButton({ messageID }:{ messageID: number }) {
    const path = usePathname();

    return (
        <form action={deleteDM} className="absolute text-primary-300 opacity-50 left-0 top-1/2 transform -translate-y-1/2 -translate-x-8 p-2 flex hidden transition duration-100 cursor-pointer hover:opacity-100 hover:scale-110 hover:text-light-100">
            <input type="hidden" name="message-id" value={messageID}/>
            <input type="hidden" name="callbackURL" value={path}/>
            <button type="submit" className="cursor-pointer">
                <DeleteIcon width="20px" />
            </button>
        </form>
    );
}