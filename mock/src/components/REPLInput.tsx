import '../styles/main.css';
import { useState} from 'react';
import { ControlledInput } from './ControlledInput';

// You can also mix the interface (as type) with concrete field names, like this:
export function REPLInput() {
    // Remember: let React manage state in your webapp. 
    // You don't always need the <...> annotation, but I like to include it for clarity.
    
    // What is the contents of the input box?
    const [commandString, setCommandString] = useState<string>('');

    // TODO: How can we keep track of the state of the count for our button?
  
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
              <ControlledInput value={commandString} setValue={setCommandString} ariaLabel={"Command input"}/>
            </fieldset>
            {/* TODO: Add a button here that keeps track of the count */}
        </div>
    );
  }