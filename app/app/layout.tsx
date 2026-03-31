import "../globals.css";
import { verifySession } from "../lib/dal";
import { fetchUserById } from "../lib/data";
import Header from "../ui/components/header";
import LeftNav from "../ui/components/leftnav";

export default async function MainLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    const session = await verifySession();
    const userID = session?.userId;
    const user = await fetchUserById(userID);

    return (
        <>
            <Header user={user} />
            <div className="bg-dark-300 grid grid-cols-[400px_auto] h-[calc(100vh-50px)]">
                <LeftNav />
                {children}
            </div>
        </>
    );
}

{/* <div className="w-32 h-8 bg-dark-100"></div>
<div className="w-32 h-8 bg-dark-200"></div>
<div className="w-32 h-8 bg-dark-300"></div>
<div className="w-32 h-8 bg-light-100"></div>
<div className="w-32 h-8 bg-light-200"></div>
<div className="w-32 h-8 bg-light-300"></div>
<div className="w-32 h-8 bg-primary-100"></div>
<div className="w-32 h-8 bg-primary-200"></div>
<div className="w-32 h-8 bg-primary-300"></div>
<div className="w-32 h-8 bg-primary-600"></div>
<div className="w-32 h-8 bg-primary-900"></div>
<div className="w-32 h-8 bg-accent-400"></div>
<div className="w-32 h-8 bg-accent-600"></div> */}