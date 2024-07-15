import { Image } from "react-bootstrap";

export const articlestyle = {
  h1: ({ ...props }) => (
    <h1
      className={`${props.className}`}
      style={{
        fontSize: "32px",
        color: "white",
        width: "80%",
        marginBottom: "20px",
        paddingBottom: "4px",
        borderBottom: "2px solid white",
      }}
    >
      {props.children}
    </h1>
  ),
  h2: ({ ...props }) => (
    <h2
      style={{
        color: "white",
        marginTop: "40px",
        marginLeft: "8px",
        paddingBottom: "4px",
        borderBottom: "2px solid white",
      }}
    >
      {props.children}
    </h2>
  ),
  h3: ({ ...props }) => (
    <h2 style={{ color: "white", marginLeft: "8px" }}>{props.children}</h2>
  ),

  a: ({ ...props }) => (
    <a
      href={props.children}
      style={{ color: "white", marginLeft: "8px", textDecoration: "none" }}
    >
      {props.children}
    </a>
  ),

  p: ({ ...props }) => (
    <p style={{ fontSize: "18px", marginLeft: "12px", color: "white" }}>
      {props.children}
    </p>
  ),
  code: ({ ...props }) => (
    <p
      style={{
        fontSize: "16px",
        fontFamily: "Courier New",
        marginLeft: "12px",
        backgroundColor: "rgba(128,128,128,0.5)",
        border: "1px solid gray",
        overflowX: "auto",
      }}
    >
      {props.children}
    </p>
  ),
  li: ({ ...props }) => (
    <li style={{ marginLeft: "12px", color: "white" }}>{props.children}</li>
  ),
  img: ({ ...props }) => {
    let style = {};
    let modal = {};
    let onClick = {};
    if (props.alt === "thumbnail") {
      style = {
        ...style,
        width: "90%",
        height: "90%",
        display: "block",
        margin: "8px auto",
      };
    }

    if (props.alt === "contentimage") {
      style = {
        ...style,
        width: "90%",
        height: "90%",
        display: "block",
        margin: "8px auto",
      };
      onClick = {};
      modal = {};
    }

    return (
      <Image
        src={`${process.env.PUBLIC_URL}/image/${props.src}`}
        style={style}
        alt="aaa"
      >
        {props.children}
      </Image>
    );
  },
};
