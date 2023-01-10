import { useMemo } from "react";
import { Link } from "react-router-dom";
import Event from "../nostr/Event";
import EventKind from "../nostr/EventKind";
import { eventLink } from "../Util";
import Note from "./Note";
import NoteGhost from "./NoteGhost";

export default function Thread(props) {
    const thisEvent = props.this;

    /** @type {Array<Event>} */
    const notes = props.notes?.map(a => Event.FromObject(a));

    // root note has no thread info
    const root = useMemo(() => notes.find(a => a.Thread === null), [notes]);

    const chains = useMemo(() => {
        let chains = new Map();
        notes.filter(a => a.Kind === EventKind.TextNote).sort((a, b) => a.CreatedAt - b.CreatedAt).forEach((v) => {
            let replyTo = v.Thread?.ReplyTo?.Event ?? v.Thread?.Root?.Event;
            if (replyTo) {
                if (!chains.has(replyTo)) {
                    chains.set(replyTo, [v]);
                } else {
                    chains.get(replyTo).push(v);
                }
            } else if (v.Tags.length > 0) {
                console.log("Not replying to anything: ", v);
            }
        });

        return chains;
    }, [notes]);

    const brokenChains = useMemo(() => {
        return Array.from(chains?.keys()).filter(a => !notes.some(b => b.Id === a));
    }, [chains]);

    const mentionsRoot = useMemo(() => {
        return notes.filter(a => a.Kind === EventKind.TextNote && a.Thread)
    }, [chains]);

    function reactions(id, kind = EventKind.Reaction) {
        return notes?.filter(a => a.Kind === kind && a.Tags.find(a => a.Key === "e" && a.Event === id));
    }

    function renderRoot() {
        if (root) {
            return <Note data-ev={root} reactions={reactions(root.Id)} deletion={reactions(root.Id, EventKind.Deletion)} threadMarker={"start"} />
        } else {
            return <NoteGhost>
                Loading thread root.. ({notes.length} notes loaded)
            </NoteGhost>
        }
    }

    function renderChain(from, inner, depth) {
        if (from && chains) {
            let replies = chains.get(from);
            if (replies) {
                return replies.map(a => {
                    let nextReplies = chains.get(a.Id)?.length ?? 0;
                    let hasInnerThread = nextReplies > 1 && !inner;
                    let hasReplies = nextReplies > 0 || replies.length > 1;
                    let isStart = inner && hasReplies;
                    return (
                        <>
                            <Note data-ev={a} key={a.Id} reactions={reactions(a.Id)} deletion={reactions(a.Id, EventKind.Deletion)} hightlight={thisEvent === a.Id} threadMarker={isStart ? "start" : (hasReplies ? "mid" : "end")} />
                            {hasInnerThread ? <div className="indented">{renderChain(a.Id, true, depth + 1)}</div> : renderChain(a.Id, false, depth + 1)}
                        </>
                    )
                });
            }
        }
    }

    return (
        <>
            {renderRoot()}
            {root ? renderChain(root.Id, false, 0) : null}
            {root ? null : <>
                <h3>Other Replies</h3>
                {brokenChains.map(a => {
                    return (
                        <>
                            <NoteGhost key={a}>
                                Missing event <Link to={eventLink(a)}>{a.substring(0, 8)}</Link>
                            </NoteGhost>
                            {renderChain(a)}
                        </>
                    )
                })}
            </>}
        </>
    );
}