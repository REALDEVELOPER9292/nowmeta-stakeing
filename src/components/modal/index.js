import { useEffect, useState } from "react";
import "./modal.css";
import { Col } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const Modal = ({ childFunc }) => {
  const [f, setFlag] = useState(false);
  const [d, setDisplay] = useState("none");
  const [header, setHeader] = useState("");
  const [text,setText] = useState("");
  const [id, setId] = useState("");
  useEffect(() => {
    childFunc.current = alertUser;
  }, [childFunc]);
  useEffect(() => {
    f ? setDisplay("modalfadeInUp") : setDisplay("modalZoomOut");
  }, [f]);
  const alertUser = (id, flag, data) => {
    const width = window.innerWidth;
    if(width > 940)
    {
      const { header, text } = data;
      setFlag(flag);
      setHeader(header);
      setText(text);
      setId(id);
    }
  };

  return (
    <>
      <Col
        id={id}
        className={`${d} modal-box`}
      >
        <CloseOutlined id="modal-close" onClick={() => setFlag(false)} />
        <h1>{header}</h1>
        <p>
          {text}
        </p>
      </Col>
    </>
  );
};

export default Modal;
