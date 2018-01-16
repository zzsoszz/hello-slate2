// Import React!
import React from 'react'
import { Editor } from 'slate-react'
import { Value } from 'slate'
import HoveringMenu from "./hovering-menu/index";
//
// const initialValue = Value.fromJSON({
//     document: {
//         nodes: [
//             {
//                 object: 'block',
//                 type: 'paragraph',
//                 nodes: [
//                     {
//                         object: 'text',
//                         leaves: [
//                             {
//                                 text: 'A line of text in a paragraph.'
//                             }
//                         ]
//                     }
//                 ]
//             }
//         ]
//     }
// })

// Define our app...
class App extends React.Component {

    // Render the editor.
    render() {
        return (
            <div>
                <HoveringMenu />
            </div>
        )
    }

}

export default App;
