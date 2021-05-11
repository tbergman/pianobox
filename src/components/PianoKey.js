import React from "react";
import styled, { css } from "styled-components";
import { DrumMachineContext } from "./DrumMachine";

let FlatKeyStyles = `
width: 28px;
height: 150px;
margin-left: -14px;
margin-right: -14px;
background: #000000;
border: 0;
padding: 0;
border-radius: 0px 0px 6px 6px;
box-shadow: 0px 4px rgba(0, 0, 0, 0.8);
filter: drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.25));
cursor: pointer;
z-index: 2;
display: flex;
justify-content: center;
align-items: flex-end;
`;

let WhiteKeyStyles = `
width: 46px;
height: 100%;
background: #ffffff;
border: 1px solid rgba(0, 0, 0, 0.15);
padding: 0;
border-radius: 0px 0px 4px 4px;
box-shadow: 0px 4px rgba(0, 0, 0, 0.15);
cursor: pointer;
display: flex;
justify-content: center;
align-items: flex-end;
`;

let WhiteKeyActiveStyle = `box-shadow: 0px 3px rgba(0, 0, 0, 0.35);
border: 1px solid rgba(0, 0, 0, 0.25);
border-top: none;
transform: translateY(2px);
transition: 0.1s;`;

let BlackKeyActiveStyle = `box-shadow: 0px 3px rgba(0, 0, 0, 0.8) !important;
filter: drop-shadow(0px 0px 0px rgba(0, 0, 0, 0)) !important;`;

const PianoKeys = styled.button`
  ${(props) =>
    props.isFlatKey
      ? css`
          ${FlatKeyStyles}
        `
      : css`
          ${WhiteKeyStyles}
        `}

  ${(props) =>
    props.isPressed && props.isFlatKey
      ? css`
          ${BlackKeyActiveStyle}
        `
      : ""}

${(props) =>
    props.isPressed && !props.isFlatKey
      ? css`
          ${WhiteKeyActiveStyle}
        `
      : ""}
`;

const NoteName = styled.span`
  margin-bottom: 5px;
  font-size: 0.8rem;
  font-family: sans-serif;

  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
`;

const PianoKey = ({ noteName, onMouseEnter, onMouseLeave, isFlatKey }) => {
  const [isPressed, setisPressed] = React.useState(false);
  const { octave } = React.useContext(DrumMachineContext);

  const pressKey = (noteName) => {
    setisPressed(true);
    onMouseEnter(noteName);
  };

  const releaseEvent = (noteName) => {
    setisPressed(false);
    onMouseLeave(noteName);
  };

  let KEYMAP = {
    [`C${octave[0]}`]: "q",
    [`C#${octave[0]}`]: "2",
    [`D${octave[0]}`]: "w",
    [`D#${octave[0]}`]: "3",
    [`E${octave[0]}`]: "e",
    [`F${octave[0]}`]: "r",
    [`F#${octave[0]}`]: "5",
    [`G${octave[0]}`]: "t",
    [`G#${octave[0]}`]: "6",
    [`A${octave[0]}`]: "y",
    [`A#${octave[0]}`]: "7",
    [`B${octave[0]}`]: "u",
    [`C${octave[1]}`]: "i",
    [`C#${octave[1]}`]: "9",
    [`D${octave[1]}`]: "o",
    [`D#${octave[1]}`]: "0",
    [`E${octave[1]}`]: "p",
    [`F${octave[1]}`]: "z",
    [`F#${octave[1]}`]: "s",
    [`G${octave[1]}`]: "x",
    [`G#${octave[1]}`]: "d",
    [`A${octave[1]}`]: "c",
    [`A#${octave[1]}`]: "f",
    [`B${octave[1]}`]: "v",
    [`C${octave[2]}`]: "b",
    [`C#${octave[2]}`]: "h",
    [`D${octave[2]}`]: "n",
    [`D#${octave[2]}`]: "j",
    [`E${octave[2]}`]: "m",
    [`F${octave[2]}`]: ",",
    [`F#${octave[2]}`]: "l",
    [`G${octave[2]}`]: ".",
    [`G#${octave[2]}`]: ";",
    [`A${octave[2]}`]: "a",
    [`A#${octave[2]}`]: "4",
    [`B${octave[2]}`]: "k",
  };

  useKey(KEYMAP[noteName], noteName, releaseEvent, pressKey);

  return (
    <PianoKeys
      isFlatKey={isFlatKey}
      isPressed={isPressed}
      onMouseEnter={(e) => {
        if (e.buttons == 1 || e.buttons == 3) onMouseEnter(noteName);
        if (e.buttons == 1 || e.buttons == 3) setisPressed(true);
      }}
      onMouseDown={(e) => {
        if (e.buttons == 1 || e.buttons == 3) onMouseEnter(noteName);
        if (e.buttons == 1 || e.buttons == 3) setisPressed(true);
      }}
      onMouseUp={() => {
        onMouseLeave(noteName);
        setisPressed(false);
      }}
      onMouseLeave={() => {
        onMouseLeave(noteName);
        setisPressed(false);
      }}
    >
      <NoteName>{noteName}</NoteName>
    </PianoKeys>
  );
};

const useKey = (key, noteName, up, down) => {
  const upcallbackRef = React.useRef(up);
  const downcallbackRef = React.useRef(down);
  const noteRef = React.useRef(noteName);

  React.useEffect(() => {
    upcallbackRef.current = up;
    downcallbackRef.current = down;
    noteRef.current = noteName;
  });

  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.repeat) {
        return;
      }
      if (event.key === key) {
        downcallbackRef.current(noteRef.current);
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === key) {
        upcallbackRef.current(noteRef.current);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [key, noteName]);
};

export default PianoKey;
