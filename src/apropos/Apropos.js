import React, { Component } from 'react'
import './Apropos.css'

class Apropos extends Component {
    render () {
        return (
            <div className='div-main'>
                <p className='title'>A propos</p>
                <h3 className='apropos-text'>Site et applications réalisés par Michel Laurent</h3>
                <a href="mailto:syndicatfrance@gmail.com"><h3 className='apropos-text'>syndicatfrance@gmail.com</h3></a>
            </div>
        )
    }
}

export default Apropos

