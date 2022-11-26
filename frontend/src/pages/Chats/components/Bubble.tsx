import "./styles/Bubble.scss";

interface Props {
  sender: string;
  time: string;
  txt: string;
}

function Bubble({ sender, time, txt }: Props) {
  const myid = sessionStorage.getItem("_id");

  return (
    <div
      className={"bubble " + (sender === myid ? "sent" : "received")}
      data-time={time}
    >
      <p>{txt}</p>
    </div>
  );
}

export default Bubble;
