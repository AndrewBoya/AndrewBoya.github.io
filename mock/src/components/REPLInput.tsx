import "../styles/main.css";
import { Dispatch, SetStateAction, useState } from "react";
import { ControlledInput } from "./ControlledInput";
import { LoadViewCSV, SearchCSV } from "../mockedJson";
import internal from "stream";

/**
 * A connection between components in the mock.
 * @param history The history of each submitted command, stored in tuples or string 2D arrays
 * @param setHistory The function by which we alter history
 * @param isVerbose Whether the current view method is verbose or not
 * @param setVerbose How to set the verbocity
 * @param data The currently stored CSV
 * @param setData How to set the currently stored data
 * @param count The current number of commands being displayed
 */
interface REPLInputProps {
  history: [string, string | string[][]][];
  setHistory: Dispatch<SetStateAction<[string, string | string[][]][]>>;
  setVerbose: Dispatch<SetStateAction<boolean>>;
  isVerbose: boolean;
  data: string[][];
  count: number;
  setData: Dispatch<SetStateAction<string[][]>>;
  //setMode:
}
/**
 * Handles the input and slight parsing of commands in the mock.
 * @param props An interface between a higher level component and a lower one.
 * @returns The input text box and submit button
 */
export function REPLInput(props: REPLInputProps) {
  // Remember: let React manage state in your webapp.
  // Manages the contents of the input box
  const [commandString, setCommandString] = useState<string>("");
  const [count, setCount] = useState<number>(0);
  const [filename, setFile] = useState<string>("");

  // This function is triggered when the button is clicked.
  function handleSubmit(commandString: string) {
    setCount(count + 1);
    setCommandString("");
    const words = commandString.split(" ");
    console.log("count:", count);
    let state: string;
    let response: string[][];

    if (words.length > 0) {
      // Get the first word (the command)
      const firstWord = words[0];

      if (firstWord == "mode") {
        let v = props.isVerbose;
        props.setVerbose(!props.isVerbose);
        state = "Mode: ";
        if (!v) {
          state += "verbose";
        } else {
          state += "simple";
        }
        props.setHistory([...props.history, [commandString, state]]);
      } else if (
        firstWord === "load_file" ||
        firstWord === "search" ||
        firstWord === "view"
      ) {
        // get the load value from the other words
        let backEndRequest = LoadViewCSV.requests.get(words[1]);
        // this value should probably be set in one of the ifs to make sure it only happends in load.
        if (firstWord == "load_file" && words.length == 2) {
          if (backEndRequest == undefined) {
            // The value isn't extant in the file system.
            state = "error-request-not-in-mock";
            response = [];
            props.setHistory([...props.history, [commandString, state]]);
          } else {
            // File exists, send response code
            state = backEndRequest.state.toString();
            response = backEndRequest.response;
            props.setHistory([...props.history, [commandString, state]]);
            setFile(words[1]);
          }
        } else if (firstWord == "search") {
          // get the search value from the other words
          //If the backend request is still undefined here shouldn't we make this an error since it means load hasn't been done successfully
          if (backEndRequest == undefined || words.length >= 2) {
            // We're not searching the whole CSV, see if we're searching by column instead
            backEndRequest = SearchCSV.requests.get(words[1] + " " + words[2]);
            if (backEndRequest == undefined) {
              // The value isn't extant in the file system.
              state = "error-request-not-in-mock";
              response = [];
              props.setHistory([...props.history, [commandString, state]]);
            } else if (filename == "") {
              // The CSV hasn't been loaded
              state = "error-csv-not-loaded";
              response = [];
              props.setHistory([...props.history, [commandString, state]]);
            } else {
              // We're searching the whole CSV and have a returnable value
              state = backEndRequest.state.toString();
              response = backEndRequest.response;
              props.setHistory([...props.history, [commandString, response]]);
            }
          } else if (words.length > 1) {
            backEndRequest = SearchCSV.requests.get(words[1]);
            if (backEndRequest == undefined) {
              state = "error-csv-not-loaded";
              response = [];
              props.setHistory([...props.history, [commandString, state]]);
            }
          }
        } else if (firstWord == "view") {
          console.log("filename:", filename);
          backEndRequest = LoadViewCSV.requests.get(filename);
          console.log("backendReq:", backEndRequest);

          if (backEndRequest == undefined) {
            state = "error-csv-not-loaded";
            props.setHistory([...props.history, [commandString, state]]);
          } else {
            response = backEndRequest.response;
            props.setHistory([...props.history, [commandString, response]]);
          }
        }
      } else {
        // This means we're calling some other function or view with more than 0 arguments.
        // This is not allowed in our spec.

        // The value isn't extant in the file system.
        state =
          "error-invalid-command:Please enter your command then press submit";
        response = [];
        props.setHistory([...props.history, [commandString, state]]);
      }
    } else {
      // This means we haven't put any thing into the box

      // The value isn't extant in the file system.
      state =
        "error-invalid-command: Please enter your command then press submit";
      props.setHistory([...props.history, [commandString, state]]);
      response = [];
    }
    // Add data to the history
    //if(firstWord==="load_file")

    // set data to new CSV
    //props.setData(response);

    // figure out a way to ask if load was in the history
    // assuming that loading the data returns the data as a list of lists
  }
  /**
   * We suggest breaking down this component into smaller components, think about the individual pieces
   * of the REPL and how they connect to each other...
   */
  return (
    <div className="repl-input">
      {/* This is a comment within the JSX. Notice that it's a TypeScript comment wrapped in
            braces, so that React knows it should be interpreted as TypeScript */}
      {/* I opted to use this HTML tag; you don't need to. It structures multiple input fields
            into a single unit, which makes it easier for screenreaders to navigate. */}
      <fieldset>
        <legend>Enter a command:</legend>
        <ControlledInput
          value={commandString}
          setValue={setCommandString}
          ariaLabel={"Command input"}
        />
      </fieldset>

      <button aria-label="button" onClick={() => handleSubmit(commandString)}>
        {/*This is where we will asign which function and/or code to use*/}
        "Submit"
      </button>
    </div>
  );
}
