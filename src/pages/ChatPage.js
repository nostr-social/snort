import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import DM from "../element/DM";
import ProfileImage from "../element/ProfileImage";

export default function ChatPage() {
    const { pubkey } = useParams();
    const dms = useSelector(s => s.login.dms.filter(a => a.pubkey === pubkey || a.tags.filter(b => b[0] === "p" && b[1] === s.login.publicKey)))

    const sortedDms = useMemo(s => {
        return [...dms].sort((a, b) => a.created_at - b.created_at)
    }, [dms]);

    return (
        <>
            <ProfileImage pubkey={pubkey} className="f-grow" link="" />
            <div className="flex f-col">
                {sortedDms.slice(-10).map(a => <DM data={a} key={a.id} />)}
            </div>
        </>
    )
}