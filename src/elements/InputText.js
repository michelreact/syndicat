import React, { Component } from 'react'
import './InputText.css'

class InputText extends Component {
    // state du component
    state = {
        // const pour recuperer le text du input
        textInputText: '',
    }

    componentDidMount () {
        const textInputText = this.props.sauvegarde
        this.setState({textInputText})
    }

    // methode pour faire passer le text
    handleOnChangeInputText = e => {
        // recuperation du text
        const textInputText = e.target.value
        // mise a jour du state avec le text du input
        this.setState({ textInputText })
        // envoi du text au travers de la methode du component parent
        this.props.recuperationInputText(textInputText)
    }

    render () {
        // recuperation des const du state
        const { textInputText } = this.state
        return(
            <div className='div-main-input-text'>
                { /* mise en place du input */ }
                <input
                    className='input-text'
                    // input de type text
                    type='text'
                    // nombre maximal de caractères
                    maxlenght={500}
                    // place holder défini par une props
                    placeholder='TEXT ICI'
                    // onChange => appel methode
                    onChange={this.handleOnChangeInputText}
                    // valeure du input
                    value={textInputText}
                />
            </div>
        )
    }
}

export default InputText
