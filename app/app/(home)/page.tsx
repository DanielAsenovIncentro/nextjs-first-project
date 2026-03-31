import RightNav from "@/app/ui/components/rightnav";
import Content from "@/app/ui/content";

export default function Page() {
    return (
        <div className="grid grid-cols-[auto_300px]">
            <Content />
            <RightNav />
        </div>
    );
}