import "./DM.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import useEventPublisher from "../feed/EventPublisher";
import Event from "../nostr/Event";
import NoteTime from "./NoteTime";
import Text from "../Text";

export default function DM({ data }) {
    const pubKey = useSelector(s => s.login.publicKey);
    const publisher = useEventPublisher();
    const [content, setContent] = useState("Loading...");

    async function decrypt() {
        let e = Event.FromObject(data);
        let decrypted = await publisher.decryptDm(e);
        setContent(decrypted);
    }

    useEffect(() => {
        decrypt().catch(console.error);
    }, [data]);

    return (
        <div className={`flex dm f-col${data.pubkey === pubKey ? " me" : ""}`}>
            <div><NoteTime from={data.created_at * 1000} /></div>
            <div className="w-max">
                <Text content={content} />
            </div>
        </div>
    )
}