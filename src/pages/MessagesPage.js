import { useMemo } from "react";
import { useSelector } from "react-redux"
import ProfileImage from "../element/ProfileImage";

export default function MessagesPage() {
    const dms = useSelector(s => s.login.dms);

    const pubKeys = useMemo(() => {
        return [...new Set([...dms].sort((a, b) => a.created_at - b.created_at).map(a => a.pubkey))];
    }, [dms]);

    function person(pubkey) {
        return (
            <div className="flex" key={pubkey}>
                <ProfileImage pubkey={pubkey} className="f-grow" link={`/messages/${pubkey}`} />
                <span className="pill">
                    {dms?.filter(a => a.pubkey === pubkey).length}
                </span>
            </div>
        )
    }

    return (
        <>
            <h3>Messages</h3>
            {pubKeys.map(person)}
        </>
    )
}