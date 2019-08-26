import React, {Component} from 'react'
import './Textarea.css'

class Textarea extends Component {
    state = {
        text: '',
    }

    componentDidMount () {
        const text = this.props.sauvegarde
        this.setState({text})
    }

    onChange = e => {
        const text = e.target.value
        this.setState({text})
        this.props.recuperationTextarea(text)
    }

    render () {
        const {text} = this.state
        const {height} = this.props
        return(
            <div className='textarea-div-main'>
                <textarea
                    className='textarea'
                    style={{height:height}}
                    type='text'
                    placeholder='TEXT ICI'
                    maxLength={5000}
                    onChange={this.onChange}
                    value={text}
                />
            </div>
        )
    }
}

export default Textarea