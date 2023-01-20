import "./Note.css";
import ProfileImage from "Element/ProfileImage";

export default function NoteGhost(props: any) {
    return (
        <div className="note">
            <div className="header">
                <ProfileImage pubkey="" />
            </div>
            <div className="body">
                {props.children}
            </div>
            <div className="footer">
            </div>
        </div>
    );
}