import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import DeleteIcon from '@material-ui/icons/Delete';
import Form from "./form";

const TodosQuery = gql`
  {
    todos {
      id
      text
      complete
    }
  }
`;


const updateMutation = gql`
  mutation($id: ID!, $complete: Boolean!) { 
    updateTodo(id: $id, complete: $complete)
  }
`;


const removeMutation = gql`
  mutation($id: ID!) { 
    removeTodo(id: $id)
  }
`;


const createTodoMutation = gql`
  mutation($text: String!){ 
    createTodo(text: $text)
    {
      id
      text
      complete
    }
}
`;


class App extends Component {


  removeTodo = async todo => {
    await this.props.removeTodo({ 
      variables: { 
        id: todo.id, 
      },
      update: (store) => {
        // Read the data from our cache for this query.
        const data = store.readQuery({ query: TodosQuery });
        // Add our comment from the mutation to the end.
        data.todos = data.todos.filter(x => x.id !== todo.id);
        // Write our data back to the cache.
        store.writeQuery({ query: TodosQuery, data });
      }
    });
  };


  updateTodo = async todo => {

    await this.props.updateTodo({ 
      variables: { 
        id: todo.id,
        complete: !todo.complete 
      },
      update: (store) => {
        // Read the data from our cache for this query.
        const data = store.readQuery({ query: TodosQuery });
        // Add our comment from the mutation to the end.
        data.todos = data.todos.map(x => x.id === todo.id ? ({
        
        ...todo,complete: !todo.complete }) : x );
        // Write our data back to the cache.
        store.writeQuery({ query: TodosQuery, data });
      }
    });
    
  };

  createTodo = async text => { 

    await this.props.createTodo({ 
      variables: {
      text
      },
      update: (store, { data: {createTodo} }) => {
        // Read the data from our cache for this query.
        const data = store.readQuery({ query: TodosQuery });
        // Add our comment from the mutation to the end.
        data.todos.push(createTodo);
        // Write our data back to the cache.
        store.writeQuery({ query: TodosQuery, data });
      }
    });



  }

  render() {
    const {
      data: { loading, todos }
    } = this.props;
    if (loading) {
      return null;
    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Today's To Do List</h1>
        </header>

        <div style={{ display: "flex" }}>
          <div style={{ margin: "auto", width: 600 }}>
            <Paper>
            <Form submit= { this.createTodo} ></Form> 
                <List>
                  {todos.map(todo => (
                    <ListItem
                       key={todo.id}
                       value={todo}
                       role={undefined}
                       dense
                      button
                      onClick={() => this.updateTodo(todo)}
                     >

                      <Checkbox
                        checked={todo.complete}
                        tabIndex={-1}
                        disableRipple
                      />

                      <ListItemText primary={`${todo.text}`} />


                      <ListItemSecondaryAction>
                      <div>
                      <DeleteIcon onClick={() => this.removeTodo(todo) }>
                      </DeleteIcon>
                    </div> 
                      </ListItemSecondaryAction>
                      
                    </ListItem>
                  ))}
                </List>
            

              <p className="App-intro">
                <code>Created by: Michael Ross Curnes</code>
              </p>
            </Paper>
          </div>
        </div>
        <div>
          Icons made by{" "}
          <a href="https://www.flaticon.com/authors/monkik" title="Organizer">
            Organizer
          </a>{" "}
          from{" "}
          <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>{" "}
          is licensed by{" "}
          <a
            href="http://creativecommons.org/licenses/by/3.0/"
            title="Creative Commons BY 3.0"
            target="_blank"
          >
            CC 3.0 BY
          </a>
        </div>
      </div>
    );
  }
}

 




export default compose(graphql(createTodoMutation, {name: "createTodo"}), graphql(removeMutation, {name: "removeTodo"}), graphql(updateMutation, {name: "updateTodo"}), graphql(TodosQuery))(App);
