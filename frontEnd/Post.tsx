import React from "react";
import { Link } from "react-router-dom";

export default function Post() {
  const page = {
    position: "relative",
  };

  const center = {
    paddingTop: 40,
    textAlign: "center",
  };

  const title = {
    fontSize: 30,
  };

  const buttonRow = {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    padding: "16px 10px",
  };

  const bottomButton = {
    padding: "12px 16px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
  };

  return (
    <div className={`page`}>
      <div className={`center`}>
        <div className={`title`}>Posting Page</div>
      </div>

      <div className={`buttonRow`}>
        <Link to="/home">
          <button className={`bottomButton`}> Home </button>
        </Link>
        <Link to="/map">
          <button className={`bottomButton`}> Map </button>
        </Link>
        <Link to="/profile">
          <button className={`bottomButton`}> Profile </button>
        </Link>
        <Link to="/post">
          <button className={`bottomButton`}> Post </button>
        </Link>
        <Link to="/search">
          <button className={`bottomButton`}> Search </button>
        </Link>
      </div>
    </div>
  );
}
