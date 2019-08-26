import React, { Component } from 'react'
import './ButtonYellow.css'

class ButtonYellow extends Component {

    // lors du click sur le boutton
    handleClick = () => {
        // envoyer en props une methode au component parent
        this.props.clickButton()
    }

    render () {
        // recuperation des props du component parent
        const { textButton } = this.props
        return(
            <div className='div-button-jaune'>
                { /* mise en place du button */ }
                <button 
                    className='button-jaune'
                    // relier une methode au click
                    onClick={this.handleClick}
                    // afficher le text via une props du component parent
                    >{textButton}
                </button>
            </div>
        )
    }
}

export default ButtonYellow
