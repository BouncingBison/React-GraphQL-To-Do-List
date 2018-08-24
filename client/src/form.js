import React from 'react'; 
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';



export default class Form extends React.Component { 



    state = { 

        text: "" 
    };

    handleChange = e => { 
        console.log(e); 
        const newText = e.target.value;
        this.setState({ 
            text: newText
        }); 
    }

    handleKeyDown = e => {
        
        console.log(e); 
        if(e.key === 'Enter'){ 

            this.props.submit(this.state.text);
        }


    }; 

    render() { 

        const {text} = this.state; 
    

        return( 
            <TextField
            onChange = {this.handleChange}
            onKeyDown = {this.handleKeyDown}
            label="What needs doing..."
            margin="normal"
            value = {text}
            fullWidth
          />
    ); 


    }


}