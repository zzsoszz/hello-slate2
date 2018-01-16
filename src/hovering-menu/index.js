
import { Editor,getEventRange, getEventTransfer } from 'slate-react'
import { Value } from 'slate'
import isImage from 'is-image'
import isUrl from 'is-url'
import React from 'react'
import ReactDOM from 'react-dom'
import initialValue from './value.json'

const root = document.getElementById('root');

/**
 * The menu.
 *
 * @type {Component}
 */

class Menu extends React.Component {

  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasMark(type) {
    const { value } = this.props
    return value.activeMarks.some(mark => mark.type == type)
  }
  hasBlock(type) {
        const { value } = this.props
        return value.blocks.some(block  => block.type == type)
  }
  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickMark(event, type) {
    const { value, onChange } = this.props
    event.preventDefault()
    const change = value.change().toggleMark(type)
    onChange(change)
  }

  onClickBlock(event, type) {
      const { value, onChange } = this.props
      event.preventDefault()
      const hasTheTypeBlock = value.blocks.some(block => block.type == type);
      console.log("hasTheTypeBlock",hasTheTypeBlock);
      const change = value.change().setBlock(hasTheTypeBlock?"paragraph":type);
      onChange(change)
  }

  /**
   * Render a mark-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderMarkButton(type, icon) {
    const isActive = this.hasMark(type)
    const onMouseDown = event => this.onClickMark(event, type)

    return (
      <span className="button" onMouseDown={onMouseDown} data-active={isActive}>
        <span className="material-icons">{icon}</span>
      </span>
    )
  }

  renderBlockButton(type, icon) {
        const isActive = this.hasBlock(type)
        const onMouseDown = event => this.onClickBlock(event, type)
        return (
            <span className="button" onMouseDown={onMouseDown} data-active={isActive}>
              <span className="material-icons">{icon}</span>
            </span>
        )
  }
  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    return (
      ReactDOM.createPortal(
        <div className="menu hover-menu" ref={this.props.menuRef}>
          {this.renderMarkButton('bold', '加粗')}
          {this.renderMarkButton('italic', '斜体')}
          {this.renderMarkButton('underlined', '下划线')}
          {this.renderMarkButton('highlight', '高亮')}
          {this.renderBlockButton('code', '代码')}
        </div>,
        root
      )
    )
  }

}

function CodeNode(props) {
    return <pre {...props.attributes}><code>{props.children}</code></pre>
}


function insertImage(change, src, target) {
    if (target) {
        change.select(target)
    }

    change.insertBlock({
        type: 'image',
        isVoid: true,
        data: {
            src,
            alignment:"left"
        }
    })
}


class Sidebar  extends React.Component{
    constructor(props){
        super(props);
    }
    componentDidMount = () => {
        this.showSideBar()
    }
    componentDidUpdate = () => {
        this.showSideBar()
    }
    showSideBar = () => {
        console.log("showSideBar",this.sidebarEle);
        const  value  = this.props.value;
        const sidebarEle = this.sidebarEle;
        if (!sidebarEle) return;
        if (value.isBlurred ) {
            //sidebarEle.removeAttribute('style')
            this.sidebarEle.style.opacity = 0;
            return
        }
        const selection = window.getSelection()
        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        this.sidebarEle.style.position="absolute";
        this.sidebarEle.style.opacity = 1
        var style=window.getComputedStyle(sidebarEle.parentElement,null);
        this.sidebarEle.style.top = `${rect.top-sidebarEle.parentElement.getBoundingClientRect().top}px`  ;//+ window.scrollY - sidebarEle.offsetHeight
        this.sidebarEle.style.left ="-40px";
    }
    sidebar = (ele) => {
        this.sidebarEle = ele;
    }
    render(){
       console.log("render");
       return (
            <div  ref={this.sidebar}>
                <span>Img</span>
            </div>
       )
    }
}
/**
 * The hovering menu example.
 *
 * @type {Component}
 */
class AlignmentImage extends React.Component{
    constructor(props)
    {
        super(props);
        this.onChange=props.onChange;
    }
    onAlignmentClick(alignment){
        this.onChange(alignment);
    }
    render(){
        return (
            <div style="position:relative">
                <img {...this.props}  />
                <div style="position:relative" className="image-alignment-bar">
                    <span onClick={this.onAlignmentClick("left")}>
                        left
                    </span>
                    <span  onClick={this.onAlignmentClick("left")}>
                        center
                    </span>
                    <span  onClick={this.onAlignmentClick("left")}>
                        right
                    </span>
                </div>
            </div>
        );
    }
}


class HoveringMenu extends React.Component {

  /**
   * Deserialize the raw initial value.
   *
   * @type {Object}
   */

  state = {
    value: Value.fromJSON(initialValue),
    // schema: {
    //     marks: {
    //         bold: props => <strong>{props.children}</strong>,
    //         code: props => <code>{props.children}</code>,
    //         italic: props => <em>{props.children}</em>,
    //         underlined: props => <u>{props.children}</u>,
    //         highlight: props => <span className="highlight">{props.children}</span>,
    //         bold: props => <strong>{props.children}</strong>
    //     }
    // }
  }

  /**
   * On update, update the menu.
   */

  componentDidMount = () => {
    this.updateMenu()
  }

  componentDidUpdate = () => {
    this.updateMenu()
  }

  /**
   * Update the menu's absolute position.
   */

  updateMenu = () => {
    const { value } = this.state
    const menu = this.menu
    if (!menu) return

    if (value.isBlurred || value.isEmpty) {
      menu.removeAttribute('style')
      return
    }

    const selection = window.getSelection()
    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    menu.style.opacity = 1
    menu.style.top = `${rect.top + window.scrollY - menu.offsetHeight}px`
    menu.style.left = `${rect.left + window.scrollX - menu.offsetWidth / 2 + rect.width / 2}px`
  }

  /**
   * On change.
   *
   * @param {Change} change
   */

  onChange = ({ value }) => {
    this.setState({ value })
  }

  /**
   * Save the `menu` ref.
   *
   * @param {Menu} menu
   */

  menuRef = (menu) => {
    this.menu = menu
  }

  /**
   * Render.
   *
   * @return {Element}
   */


    /**
     * Render a Slate mark.
     *
     * @param {Object} props
     * @return {Element}
     */

    renderMark = (props) => {
        const { children, mark } = props
        switch (mark.type) {
            case 'bold': return <strong>{children}</strong>
            case 'italic': return <em>{children}</em>
            case 'underlined': return <u>{children}</u>
            case 'highlight': return <span className="highlight">{children}</span>
        }
    }

   alignmentChange= ()=>{
       // editor.change((change) => {
       //     change.selectAll().delete()
       // })
   }

    renderNode = (props) => {
        const { attributes, node, isSelected,editor } = props
        switch (props.node.type) {
            case 'code': return <CodeNode {...props} />
            case 'image': {
                const src = node.data.get('src')
                const alignment = node.data.get('alignment')
                const className = isSelected ? 'active' : null
                const style = { display: 'block' }
                return (
                    <AlignmentImage src={src} className={className} alignment={alignment} onChange={this.alignmentChange.bind(editor)} style={style} {...attributes} />
                )
            }
        }
    }
    //<img src={src} className={className} alignment={alignment} style={style} {...attributes} />


    onDropOrPaste = (event, change, editor) => {
        const target = getEventRange(event, change.value)
        if (!target && event.type == 'drop') return

        const transfer = getEventTransfer(event)
        const { type, text, files } = transfer

        if (type == 'files') {
            for (const file of files) {
                const reader = new FileReader()
                const [ mime ] = file.type.split('/')
                if (mime != 'image') continue

                reader.addEventListener('load', () => {
                    editor.change((c) => {
                        c.call(insertImage, reader.result, target)
                    })
                })

                reader.readAsDataURL(file)
            }
        }

        if (type == 'text') {
            if (!isUrl(text)) return
            if (!isImage(text)) return
            change.call(insertImage, text, target)
        }
    }

  render() {
    return (
      <div>
        <Menu
          menuRef={this.menuRef}
          value={this.state.value}
          onChange={this.onChange}
        />
        <div className="editor">
          <Editor
            placeholder="Enter some text..."
            value={this.state.value}
            onChange={this.onChange}
           // schema={this.state.schema}
            renderMark={this.renderMark}
            renderNode={this.renderNode}
            onDrop={this.onDropOrPaste}
            onPaste={this.onDropOrPaste}
          />
            <Sidebar  value={this.state.value} />
        </div>
      </div>
    )
  }



}

/**
 * Export.
 */

export default HoveringMenu
