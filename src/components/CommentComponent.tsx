import { IonIcon, IonText } from "@ionic/react";
import { checkmarkCircleOutline, closeCircleOutline } from "ionicons/icons";
import React, { useState } from "react";
import { Comment } from "../types/OzbargainDeal";
import "./CommentComponent.css";

const LEFT_OFFSET = 10;

type Props = {
  comment: Comment;
  leftOffset?: number;
};

function getIcon(userVoted: Comment["userVoted"]): JSX.Element | null {
  const style = {
    position: "relative",
    top: "2px",
  };

  switch (userVoted) {
    case "neg":
      return <IonIcon style={style} color="danger" icon={closeCircleOutline} />;
    case "pos":
      return (
        <IonIcon style={style} color="success" icon={checkmarkCircleOutline} />
      );
    default:
      return null;
  }
}

function getReceivedVotesEl(comment: Comment): JSX.Element | null {
  if (!comment.recievedVotes) return null;
  const color = comment.recievedVotesType === "pos" ? "success" : "warning";

  return (
    <span className={`comment-votes comment-votes-${color}`}>
      {comment.recievedVotes}
    </span>
  );
}

const CommentComponent = ({ comment, leftOffset }: Props) => {
  const [hidden, setHidden] = useState(false);

  const icon = getIcon(comment.userVoted);
  const recievedVotesEl = getReceivedVotesEl(comment);
  const offset = (leftOffset || 0) + LEFT_OFFSET;

  return (
    <div className="comment-container">
      <div>
        <IonText color={hidden ? "medium" : undefined}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "baseline",
            }}
          >
            <h6 onClick={() => setHidden(!hidden)}>
              {icon} <strong>{comment.username}</strong> {recievedVotesEl}
            </h6>
            <span className="comment-date">{comment.date}</span>
          </div>
        </IonText>

        <div
          className={[
            "comment-content-container",
            hidden ? "comment--hidden" : "comment--visible",
          ].join(" ")}
        >
          <IonText>
            <p className="comment-content">{comment.content}</p>
          </IonText>

          {comment.comments.length > 0 && (
            <div style={{ paddingLeft: `${offset}px` }}>
              {comment.comments.map((nestedComment) => (
                <CommentComponent
                  key={`comment-recursive-${nestedComment.id}`}
                  comment={nestedComment}
                  leftOffset={offset}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentComponent;
